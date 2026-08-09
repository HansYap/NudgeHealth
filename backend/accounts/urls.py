from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, MeView, LogoutView

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("login/", TokenObtainPairView.as_view()),       # built into simplejwt, no view needed
    path("login/refresh/", TokenRefreshView.as_view()),  # exchanges refresh token for new access token
    path("me/", MeView.as_view()),
    path("logout/", LogoutView.as_view()),
]