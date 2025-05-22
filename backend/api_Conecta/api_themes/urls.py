
from api_themes.views import ThemeListCreateView, AIAnalysisListView, ThemeListView
from django.urls import path

urlpatterns = [
    path('themes/', ThemeListCreateView.as_view(), name='theme-list-create'),
    path('themes/<int:project_id>/', ThemeListView.as_view(), name='project-themes'),
    path('ai-analysis/<int:project_id>', AIAnalysisListView.as_view(), name='ai-analysis-list'),

]