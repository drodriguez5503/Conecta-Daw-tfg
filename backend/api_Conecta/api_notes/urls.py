from django.urls import path
from .views import NoteListCreate, NoteRetrieveUpdateDestroy, ProjectLinksList, LinkListCreate, \
    LinkRetrieveUpdateDestroy, TagListCreate, TagRetrieveUpdateDestroy, GetNoteById

urlpatterns = [
    path('projects/<int:project_id>/notes/', NoteListCreate.as_view(), name='note-list-create'),
    path('projects/<int:project_id>/notes/<int:pk>/', NoteRetrieveUpdateDestroy.as_view(), name='note-retrieve-update-destroy'),
    path('projects/<int:project_id>/notes/<int:pk>',GetNoteById.as_view(), name='note-get-by-id'),
    path('links/', LinkListCreate.as_view(), name='link-list-create'),
    path('links/<int:pk>/', LinkRetrieveUpdateDestroy.as_view(), name='link-detail'),
    path('projects/<int:project_id>/links/', ProjectLinksList.as_view(), name='project-links-list'),
    path('tags/', TagListCreate.as_view(), name='tag-list-create'),
    path('tags/<int:pk>/', TagRetrieveUpdateDestroy.as_view(), name='tag-detail')
]