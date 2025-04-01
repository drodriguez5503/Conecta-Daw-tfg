from django.db import models
from api_users.models import User
from api_projects.models import Project
from firebase_admin import db

class Note(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    createdAt = models.DateField(auto_now_add=True)
    modifiedAt = models.DateField(auto_now=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    tags = models.ManyToManyField('Tag', related_name='notes')
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='notes')

    def __str__(self):
        return self.title

class Tag(models.Model):
    name = models.CharField(max_length=255)

    def __str__(self):
        return self.name

class Link(models.Model):
    originNote = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='origin_links')
    destinationNote = models.ForeignKey(Note, on_delete=models.CASCADE, related_name='destination_links')

    def __str__(self):
        return f"Link from {self.originNote} to {self.destinationNote}"
