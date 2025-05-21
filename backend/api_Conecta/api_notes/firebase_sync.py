# api_notes/firebase_sync.py
from django.db import transaction
from firebase_admin import db
from .models import Note
from api_users.models import User
from api_projects.models import Project

def sync_data_from_firebase():
    notes_ref = db.reference('projects/')

    notes_data = notes_ref.get()
    print(f"Notes data: {notes_data}")

    if notes_data:
        for project_id, project_data in notes_data.items():
            if project_data and 'notes' in project_data:
                for note_id, note_data in project_data['notes'].items():
                    try:
                        project = Project.objects.get(id=project_id)
                        author = User.objects.get(id=note_data['author'])

                        Note.objects.update_or_create(
                            id=note_id,
                            defaults={
                                'title': note_data['title'],
                                'content': note_data['content'],
                                'createdAt': note_data['createdAt'],
                                'modifiedAt': note_data['modifiedAt'],
                                'author': author,
                                'project': project
                            }
                        )
                    except Project.DoesNotExist:
                        print(f"Proyecto con ID {project_id} no encontrado en PostgreSQL.")
                    except User.DoesNotExist:
                        print(f"Usuario con ID {note_data['author']} no encontrado en PostgreSQL.")

    local_note_ids = set(Note.objects.values_list('id', flat=True))
    firebase_note_ids = set()

    if notes_data:
        for project_id, project_data in notes_data.items():
            if project_data and 'notes' in project_data:
                firebase_note_ids.update(project_data['notes'].keys())

    notes_to_delete = local_note_ids - firebase_note_ids

    with transaction.atomic():
        Note.objects.filter(id__in=notes_to_delete).delete()
    print(f"Deleted notes with IDs: {notes_to_delete}")
