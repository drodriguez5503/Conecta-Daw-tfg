from celery import shared_task
from firebase_admin import db
from .models import Note

@shared_task
def sync_data_from_firebase():
    ref = db.reference('notes')  # Referencia a Firebase
    firebase_notes = ref.get()

    if not firebase_notes:
        return "No hay datos en Firebase"

    for note_id, note_data in firebase_notes.items():
        id = note_data.get('id')

        if id:
            Note.objects.filter(id=id).update(
                title=note_data.get('title', ''),
                content=note_data.get('content', ''),
                tags = note_data.get('tags', [])
            )
        else:
            new_note = Note.objects.create(
                title=note_data.get('title', ''),
                content=note_data.get('content', '')
            )
            ref.child(note_id).update({'postgres_id': new_note.id})

    return "Sincronización completada"

