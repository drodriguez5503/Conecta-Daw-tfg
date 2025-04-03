from __future__ import absolute_import, unicode_literals
import os
from celery import Celery


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "api_Conecta.settings")

app = Celery("api_Conecta")

app.config_from_object("django.conf:settings", namespace="CELERY")

app.autodiscover_tasks()

from celery.schedules import crontab

app.conf.beat_schedule = {
    'sync_firebase_every_minute': {
        'task': 'api_notes.tasks.sync_data_from_firebase',
        'schedule': crontab(minute='*/1'),
    },
}
