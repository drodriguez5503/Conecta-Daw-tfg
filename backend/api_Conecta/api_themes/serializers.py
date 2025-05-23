from rest_framework import serializers
from .models import Theme, AIAnalysis


class ThemeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Theme
        fields = ('id', 'name', 'description', 'linkedNotes')

class AIAnalysisSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIAnalysis
        fields = ('id', 'note', 'identified_theme', 'noteSimilarity')

