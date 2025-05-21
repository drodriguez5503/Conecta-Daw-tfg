from api_notes.urls import urlpatterns
from api_notes.views import LinkListCreate
from api_themes.views import ThemeListCreateView, ThemeDetailView, AIAnalysisCreateView
from django.urls import path

urlpatterns = [
    path('themes/', ThemeListCreateView.as_view(), name='theme-list-create'),
    path('themes/<int:pk>/', ThemeDetailView.as_view(), name='theme-detail'),
    path('ai-analysis/', AIAnalysisCreateView.as_view(), name='ai-analysis-list-create'),

]