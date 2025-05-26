from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from api_projects.models import Project
from .models import Note, Tag, Link
from .serializers import NoteSerializer, TagSerializer, LinkSerializer

class NoteListCreate(generics.ListCreateAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        project_id = self.kwargs['project_id']
        project = Project.objects.get(id=project_id)

        if user not in project.users.all():
            raise PermissionDenied("You are not authorized to view this project.")

        return Note.objects.filter(project=project)

    def perform_create(self, serializer):

        project_id = self.kwargs['project_id']
        project = get_object_or_404(Project, id=project_id)

        if self.request.user not in project.users.all():
            raise PermissionDenied("Can not create note on a Project that you are not a part of")

        serializer.save(project=project, author=self.request.user)

class NoteRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        note = super().get_object()

        if self.request.user not in note.project.users.all():
            raise PermissionDenied("Can not access note on a Project that you are not a part of")

        return note

    def perform_update(self, serializer):
        note = self.get_object()

        if self.request.user not in note.project.users.all():
            raise PermissionDenied("Can not modify note on a Project that you are not a part of")

        serializer.save()

    def perform_destroy(self, instance):
        if self.request.user not in instance.project.users.all():
            raise PermissionDenied("Can not delete note on a Project that you are not a part of.")

        instance.delete()

class GetNoteById(APIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self,request, id):
        try:
            note = Note.objects.get(id=id)
            serializer = NoteSerializer(note)
            return Response({"note": serializer.data}, status=status.HTTP_200_OK)
        except Note.DoesNotExist:
            return Response({"message":"Note not found"}, status=status.HTTP_404_NOT_FOUND)


class LinkListCreate(generics.ListCreateAPIView):
    queryset = Link.objects.all()
    serializer_class = LinkSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Link.objects.filter(originNote__project__users=self.request.user)
        return Link.objects.none()

    def perform_create(self, serializer):
        originNote = serializer.validated_data['originNote']
        destinationNote = serializer.validated_data['destinationNote']

        if not originNote or not destinationNote:
            raise PermissionDenied("Both origin and destination notes must be provided.")

        if originNote.project != destinationNote.project:
            raise PermissionDenied("Can not create links between notes of different projects.")

        if Link.objects.filter(
                Q(originNote=originNote, destinationNote=destinationNote) |
                Q(originNote=destinationNote, destinationNote=originNote)
        ).exists():
            raise ValidationError("This link already exists.")

        serializer.save(originNote=originNote, destinationNote=destinationNote)

class LinkRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Link.objects.all()
    serializer_class = LinkSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        return Link.objects.filter(originNote__project__users=self.request.user)

    def delete(self, request, *args, **kwargs):
        link = self.get_object()
        if request.user not in link.originNote.project.users.all():
            raise PermissionDenied("You do not have permission to delete this link.")
        return super().delete(request, *args, **kwargs)

class ProjectLinksList(generics.ListAPIView):
    serializer_class = LinkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        project_id = self.kwargs['project_id']
        user = self.request.user

        return Link.objects.filter(originNote__project_id=project_id, originNote__project__users=user)

class TagListCreate(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TagRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


