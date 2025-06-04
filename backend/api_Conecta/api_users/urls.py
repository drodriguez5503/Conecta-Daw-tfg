from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api_users.views import RegisterView, LoginView, CheckTokenView, GetUserByUsernameView, GetUserByIdView, \
    GetUserInformationView, UpdateUserInformationView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('check-token/', CheckTokenView.as_view(), name='check-token'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/<str:username>', GetUserByUsernameView.as_view(), name='username'),
    path('users/<int:pk>',GetUserByIdView.as_view(),name='id'),
    path('users/info/', GetUserInformationView.as_view(), name='info'),
    path('users/update/', UpdateUserInformationView.as_view(), name='update_user_information'),
]