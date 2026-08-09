from django.conf import settings
from django.db import models


class DailyLog(models.Model):
    class Feeling(models.TextChoices):
        NOT_GREAT = "not_great", "Not Great"
        OKAY = "okay", "Okay"
        GOOD = "good", "Good"

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="diary_logs")
    feeling = models.CharField(max_length=10, choices=Feeling.choices)
    note = models.TextField(blank=True)
    logged_at = models.DateTimeField(auto_now_add=True)   # set once, at creation — every save is its own row now

    class Meta:
        ordering = ["-logged_at"]

    def __str__(self):
        return f"{self.user.email} — {self.logged_at} — {self.feeling}"