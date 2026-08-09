from rest_framework import generics, permissions
from rest_framework import permissions, status
from .serializers import RegisterSerializer, UserSerializer
from .models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView


class RegisterView(generics.CreateAPIView):
    """Anyone can hit this — it's how new accounts get created."""
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class MeView(generics.RetrieveAPIView):
    """Only a logged-in user can hit this — returns their own profile."""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
    

class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(refresh_token).blacklist()
        except Exception:
            return Response({"detail": "invalid or already logged out"}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_205_RESET_CONTENT)