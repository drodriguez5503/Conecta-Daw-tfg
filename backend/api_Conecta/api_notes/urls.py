from django.urls import path
from .views import NoteListCreate, NoteRetrieveUpdateDestroy, ProjectLinksList, LinkListCreate, \
    LinkRetrieveUpdateDestroy

urlpatterns = [
    path('projects/<int:project_id>/notes/', NoteListCreate.as_view(), name='note-list-create'),
    path('projects/<int:project_id>/notes/<int:pk>/', NoteRetrieveUpdateDestroy.as_view(), name='note-retrieve-update-destroy'),
    path('links/', LinkListCreate.as_view(), name='link-list-create'),
    path('links/<int:pk>/', LinkRetrieveUpdateDestroy.as_view(), name='link-detail'),
    path('projects/<int:project_id>/links/', ProjectLinksList.as_view(), name='project-links-list'),
]