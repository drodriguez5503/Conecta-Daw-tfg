from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from api_users.views import RegisterView, LoginView, CheckTokenView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('check-token/', CheckTokenView.as_view(), name='check-token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]