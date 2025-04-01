# api_notes/firebase_sync.py

from firebase_admin import db
from .models import Note
from api_users.models import User
from api_projects.models import Project

def sync_data_from_firebase():
    notes_ref = db.reference('projects/')

    notes_data = notes_ref.get()

    if notes_data:
        for project_id, project_data in notes_data.items():
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
