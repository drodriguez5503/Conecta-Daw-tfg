from django.urls import path
from .views import NoteListCreate, NoteRetrieveUpdateDestroy

urlpatterns = [
    path('projects/<uuid:project_id>/notes/', NoteListCreate.as_view(), name='note-list-create'),
    path('projects/<uuid:project_id>/notes/<uuid:pk>/', NoteRetrieveUpdateDestroy.as_view(), name='note-retrieve-update-destroy'),
]