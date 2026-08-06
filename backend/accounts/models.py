from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser
from django.db import models


class UserManager(BaseUserManager):
    """Tells Django how to create users when email is the login field,
    instead of the default username."""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # this hashes the password, never stores it plain
        user.save()
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class User(AbstractUser):
    """AbstractUser gives us all of Django's built-in user stuff (password
    hashing, permissions, is_active, etc.) for free — we're just swapping
    out username for email as the login field."""

    username = None  # we don't want this field at all
    email = models.EmailField(unique=True)
    state = models.CharField(max_length=40, blank=True)  # which Malaysian state, used later for clinics

    USERNAME_FIELD = "email"   # this is what Django uses to log in
    REQUIRED_FIELDS = []       # extra fields asked for by createsuperuser — none needed

    objects = UserManager()    # tell Django to use our custom manager above

    def __str__(self):
        return self.email