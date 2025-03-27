from api_Conecta.api_notes.urls import urlpatterns
from api_Conecta.api_notes.views import LinkListCreate
from api_Conecta.api_themes.views import ThemeListCreate, ThemeRetrieveUpdateDestroy, AIAnalysisListCreate, \
    AIAnalysisRetrieveUpdateDestroy
from django.urls import path

urlpatterns = [
    path('themes/', ThemeListCreate.as_view(), name='theme-list-create'),
    path('themes/<int:pk>/', ThemeRetrieveUpdateDestroy.as_view(), name='theme-detail'),
    path('ai-analysis/', AIAnalysisListCreate.as_view(), name='ai-analysis-list-create'),
    path('ai-analysis/<int:pk>/', AIAnalysisRetrieveUpdateDestroy.as_view(), name='ai-analysis-detail'),
]