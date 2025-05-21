from datetime import datetime
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.dispatch.dispatcher import logger
from transformers import pipeline
from .models import Note, Tag, Link
from firebase_admin import db
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Note
from api_themes.models import AIAnalysis, Theme
from sentence_transformers import SentenceTransformer, util
from django.conf import settings
from django.db import transaction


@receiver(post_save, sender=Note)
def sync_postgres_to_firebase(sender, instance, **kwargs):
    ref = db.reference(f'projects/{instance.project.id}/notes/{instance.id}')
    created_at = instance.createdAt
    modified_at = instance.modifiedAt

    if isinstance(created_at, str) and created_at:
        created_at = datetime.fromisoformat(created_at)
    elif created_at is None:
        created_at = datetime.now()

    ref.set({
        "title": instance.title,
        "content": instance.content,
        "createdAt": created_at.isoformat(),
        "modifiedAt": modified_at.isoformat(),
        "author": instance.author.id,
        "tags": [tag.id for tag in instance.tags.all()],
    })

@receiver(post_delete, sender=Note)
def delete_note_from_firebase(sender, instance, **kwargs):
    ref = db.reference(f'projects/{instance.project.id}/notes/{instance.id}')
    ref.delete()

@receiver(post_save, sender=Tag)
def sync_tag_to_firebase(sender, instance, **kwargs):
    ref = db.reference(f'tags/{instance.id}')
    ref.set({"name": instance.name})

@receiver(post_delete, sender=Tag)
def delete_tag_from_firebase(sender, instance, **kwargs):
    ref = db.reference(f'tags/{instance.id}')
    ref.delete()

@receiver(post_save, sender=Link)
def sync_link_to_firebase(sender, instance, **kwargs):
    ref = db.reference(f'links/{instance.id}')
    ref.set({
        "originNote": instance.originNote.id,
        "destinationNote": instance.destinationNote.id
    })

@receiver(post_delete, sender=Link)
def delete_link_from_firebase(sender, instance, **kwargs):
    ref = db.reference(f'links/{instance.id}')
    ref.delete()


model = SentenceTransformer(settings.SENTENCE_TRANSFORMER_MODEL)

@receiver(post_save, sender=Note)
def perform_ai_analysis_on_save(sender, instance, created, **kwargs):
    note = instance
    note_similarity = {}
    notes_to_compare = Note.objects.filter(project=note.project).exclude(id=note.id)

    if notes_to_compare:
        other_note_contents = [other_note.content for other_note in notes_to_compare]
        other_note_embeddings = model.encode(other_note_contents, convert_to_tensor=True)
        note_embeddings = model.encode(note.content, convert_to_tensor=True)

        for i, other_note in enumerate(notes_to_compare):
            similarity = util.pytorch_cos_sim(note_embeddings, other_note_embeddings[i]).item()
            note_similarity[str(other_note.id)] = similarity


    identified_themes = []

    with transaction.atomic():
        ai_analysis, created = AIAnalysis.objects.get_or_create(note=note, defaults={'noteSimilarity': note_similarity})
        if not created:
            ai_analysis.noteSimilarity = note_similarity
            ai_analysis.save()
        ai_analysis.identified_theme.set(identified_themes)

@receiver(post_delete, sender=Note)
def perform_ai_analysis_on_delete(sender, instance, **kwargs):
    note = instance
    with transaction.atomic():
        try:
            ai_analysis = AIAnalysis.objects.get(note=note)
            ai_analysis.delete()
        except AIAnalysis.DoesNotExist:
            pass

        for analysis in AIAnalysis.objects.all():
            if str(note.id) in analysis.noteSimilarity:
                del analysis.noteSimilarity[str(note.id)]
                analysis.save()

theme_extraction_model = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

theme_generation_model = pipeline("summarization", model="facebook/bart-large-cnn")

@receiver(post_save, sender=Note)
def perform_theme_analysis_on_save(sender, instance, created, **kwargs):
    if created or not created:
        note = instance

        try:
            theme_description = theme_generation_model(note.content, max_length=20, min_length=10)[0]['summary_text']
            theme, created = Theme.objects.get_or_create(name=theme_description)
            note.themes.set([theme])
        except Exception as e:
            logger.error(f"Error during theme analysis: {e}", exc_info=True)

