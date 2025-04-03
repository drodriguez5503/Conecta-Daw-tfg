from datetime import datetime

from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import Note, Tag, Link
from firebase_admin import db


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

