from rest_framework import generics, permissions
from rest_framework.exceptions import PermissionDenied

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
        project = Project.objects.get(id=project_id)

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

class TagListCreate(generics.ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TagRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class LinkListCreate(generics.ListCreateAPIView):
    queryset = Link.objects.all()
    serializer_class = LinkSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class LinkRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Link.objects.all()
    serializer_class = LinkSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
