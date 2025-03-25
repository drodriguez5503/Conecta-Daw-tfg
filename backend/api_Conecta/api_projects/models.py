from django.db import models
from api_users.models import User

class Project(models.Model):
    name = models.CharField(max_length=255)
    users = models.ManyToManyField(User, related_name='projects')

    def __str__(self):
        return self.name