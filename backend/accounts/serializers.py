from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    # Accepted in requests but never returned in API responses
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ["email", "password"]

    def create(self, validated_data):
        # Uses UserManager.create_user() so the password is hashed
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email"]