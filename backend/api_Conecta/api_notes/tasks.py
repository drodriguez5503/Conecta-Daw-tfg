from celery import shared_task
from firebase_admin import db
from .models import Note

@shared_task
def sync_data_from_firebase():
    projects_ref = db.reference('projects')
    projects = projects_ref.get()

    if not projects:
        return "No hay proyectos en Firebase"

    for project_id, project_data in projects.items():
        notes_ref = db.reference(f'projects/{project_id}/notes')
        firebase_notes = notes_ref.get()

        if firebase_notes:
            for note_id, note_data in firebase_notes.items():
                # Extraer datos de la nota
                note_title = note_data.get('title', '')
                note_content = note_data.get('content', '')
                note_author = note_data.get('author', None)
                created_at = note_data.get('createdAt', None)
                modified_at = note_data.get('modifiedAt', None)

                # Buscar si la nota ya existe en PostgreSQL por ID de Firebase
                note, created = Note.objects.update_or_create(
                    id=note_id,  # Usar el ID de Firebase como clave primaria
                    defaults={
                        'title': note_title,
                        'content': note_content,
                        'author_id': note_author,
                        'created_at': created_at,
                        'modified_at': modified_at,
                    }
                )

    return "Sincronización de Firebase con PostgreSQL completada"
