from django.contrib.auth import get_user_model
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from .serializers import UserSerializer, LoginSerializer, TokenSerializer, UserProfileUpdateSerializer

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            token_serializer = TokenSerializer.get_tokens(user)
            return Response(token_serializer, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CheckTokenView(APIView):
    def get(self, request):
        return Response({"message": "Token is valid"}, status=status.HTTP_200_OK)


class GetUserByUsernameView(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
            serializer = UserSerializer(user)
            return Response({"user": serializer.data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)

class GetUserByIdView(APIView):
    def get(self, request, id):
        try:
            user = User.objects.get(id=id)
            serializer = UserSerializer(user)
            return Response({"user": serializer.data}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"message":"User not found"}, status=status.HTTP_404_NOT_FOUND)

class GetUserInformationView(APIView):
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)

class UpdateUserInformationView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'pk'

    def get_object(self):
        return self.request.user