from django.shortcuts import render
from rest_framework import generics, permissions

from api_Conecta.api_projects.models import Project
from api_Conecta.api_themes.models import Theme, AIAnalysis
from api_Conecta.api_themes.serializers import ThemeSerializer, AIAnalysisSerializer


class ThemeListCreate(generics.ListCreateAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer

class ThemeRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer

class AIAnalysisListCreate(generics.ListCreateAPIView):
    queryset = AIAnalysis.objects.all()
    serializer_class = AIAnalysisSerializer

class AIAnalysisRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = AIAnalysis.objects.all()
    serializer_class = AIAnalysisSerializer