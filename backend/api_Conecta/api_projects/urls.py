from django.urls import path
from api_projects.views import ProjectListCreate, ProjectRetrieveUpdateDestroy, AddUserToProject

urlpatterns = [
    path('projects/', ProjectListCreate.as_view(), name='project-list-create'),
    path('projects/<int:pk>/', ProjectRetrieveUpdateDestroy.as_view(), name='project-retrieve-update-destroy'),

    path('projects/<int:pk>/add_user/', AddUserToProject.as_view(), name='add-user-to-project'),

]