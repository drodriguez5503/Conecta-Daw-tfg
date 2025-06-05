from celery import shared_task
from django.db import transaction
from firebase_admin import db
from .models import Note
import logging

logger = logging.getLogger(__name__)

@shared_task
def sync_data_from_firebase():
    logger.info("Initializing data sync")
    try:
        projects_ref = db.reference('projects')
        projects = projects_ref.get()

        if not projects:
            logger.warning("No hay proyectos en Firebase")
            return "No hay proyectos en Firebase"

        firebase_note_ids = set()
        for project_id, project_data in projects.items():
            notes_ref = db.reference(f'projects/{project_id}/notes')
            firebase_notes = notes_ref.get()
            if firebase_notes:
                for note_id in firebase_notes:
                    try:
                        firebase_note_ids.add(int(note_id))
                    except ValueError:
                        logger.warning(f"ID de nota inválido en Firebase: {note_id}")

        local_note_ids = set(Note.objects.values_list('id', flat=True))
        notes_to_delete = local_note_ids - firebase_note_ids

        with transaction.atomic():
            Note.objects.filter(id__in=notes_to_delete).delete()
        print(f"Deleted notes with IDs: {notes_to_delete}")

        for project_id, project_data in projects.items():
            notes_ref = db.reference(f'projects/{project_id}/notes')
            firebase_notes = notes_ref.get()
            if firebase_notes:
                for note_id, note_data in firebase_notes.items():
                    note_title = note_data.get('title', '')
                    note_content = note_data.get('content', '')
                    note_author = note_data.get('author', None)
                    created_at = note_data.get('createdAt', None)
                    modified_at = note_data.get('modifiedAt', None)

                    note, created = Note.objects.update_or_create(
                        id=note_id,
                        defaults={
                            'title': note_title,
                            'content': note_content,
                            'author_id': note_author,
                            'created_at': created_at,
                            'modified_at': modified_at,
                        }
                    )

        logger.info("Sincronización completada correctamente")
        return "Sincronización de Firebase con PostgreSQL completada"
    except Exception as e:
        logger.error(f"Error: {str(e)}", exc_info=True)
        return f"Error: {str(e)}"
