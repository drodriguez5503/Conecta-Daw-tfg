from django.db import models

from api_Conecta.api_notes.models import Note


class Theme (models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField
    linkedNotes = models.ManyToManyField(Note, related_name="themes")

    def __str__(self):
        return self.name

class AIAnalysis (models.Model):
    note = models.OneToOneField(Note, on_delete=models.CASCADE, related_name="ai_analysis")
    identified_theme = models.ManyToManyField(Theme)
    noteSimilarity= models.JSONField(default=dict)

    def __str__(self):
        return f"AI analysis para {self.note.title}"
