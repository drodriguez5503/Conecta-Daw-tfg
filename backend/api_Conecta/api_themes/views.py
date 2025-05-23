from django.http import Http404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from sentence_transformers import SentenceTransformer, util

from api_projects.models import Project
from .serializers import AIAnalysisSerializer
from .models import Note, Theme, AIAnalysis
from django.conf import settings


from rest_framework import generics, permissions
from .serializers import ThemeSerializer
from .models import Theme


class ThemeListCreateView(generics.ListCreateAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = [permissions.IsAuthenticated]

class ThemeListView(generics.ListAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        project_id = self.kwargs['project_id']
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise Http404("Proyecto no encontrado")

        if user not in project.users.all():
            raise PermissionDenied("No tienes permiso para ver este proyecto.")

        themes = Theme.objects.filter(linkedNotes__project=project).distinct()

        return themes

    def admin_themes(self):
        user = self.request.user
        if user.is_superuser:
            return Theme.objects.all()
        return None


class AIAnalysisListView(generics.ListAPIView):
    serializer_class = AIAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        project_id = self.kwargs['project_id']
        try:
            project = Project.objects.get(id=project_id)
        except Project.DoesNotExist:
            raise Http404("Project not found")

        if user not in project.users.all():
            raise PermissionDenied("You are not authorized to view this project.")


        ai_analyses = AIAnalysis.objects.filter(note__project=project)
        return ai_analyses
