from django.urls import path
from api_projects.views import ProjectListCreate, ProjectRetrieveUpdateDestroy

urlpatterns = [
    path('projects/', ProjectListCreate.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectRetrieveUpdateDestroy.as_view(), name='project-retrieve-update-destroy'),
]