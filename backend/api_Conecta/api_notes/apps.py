from django.apps import AppConfig
from django.db.models.signals import post_migrate


class ApiNotesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api_notes'

    def ready(self):
        import api_notes.signals
        post_migrate.connect(self.sync_firebase_on_ready, sender=self)

    def sync_firebase_on_ready(sender, **kwargs):
        from .firebase_sync import sync_data_from_firebase
        sync_data_from_firebase()