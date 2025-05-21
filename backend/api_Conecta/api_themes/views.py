from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from sentence_transformers import SentenceTransformer, util
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


class ThemeDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Theme.objects.all()
    serializer_class = ThemeSerializer
    permission_classes = [permissions.IsAuthenticated]



class AIAnalysisCreateView(generics.CreateAPIView):

    serializer_class = AIAnalysisSerializer
    permission_classes = [permissions.IsAuthenticated]
    model = SentenceTransformer(settings.SENTENCE_TRANSFORMER_MODEL)

    def create(self, request, *args, **kwargs):
        note_id = request.data.get('note')
        theme_ids = request.data.get('identifiedTheme', [])

        note = get_object_or_404(Note, id=note_id)
        themes = Theme.objects.filter(id__in=theme_ids)

        if len(themes) != len(theme_ids):
            return Response(
                {"error": "One or more Theme IDs are invalid."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        note_similarity = self.perform_ai_analysis(note)
        al_analysis = AIAnalysis.objects.create(note=note, noteSimilarity=note_similarity)
        al_analysis.identified_theme.set(themes)

        serializer = self.get_serializer(al_analysis)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def perform_ai_analysis(self, note):
        note_similarity = {}
        notes_to_compare = Note.objects.filter(project=note.project).exclude(id=note.id)

        if notes_to_compare:
            other_note_contents = [other_note.content for other_note in notes_to_compare]
            other_note_embeddings = self.model.encode(other_note_contents, convert_to_tensor=True)
            note_embeddings = self.model.encode(note.content, convert_to_tensor=True)

            for i, other_note in enumerate(notes_to_compare):
                similarity = util.pytorch_cos_sim(note_embeddings, other_note_embeddings[i]).item()
                note_similarity[str(other_note.id)] = similarity

        return note_similarity
