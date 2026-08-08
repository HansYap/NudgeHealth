from django.db import models


class Clinic(models.Model):
    facility_code = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50)
    facility_subtype = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=40)
    district = models.CharField(max_length=60, blank=True)
    address = models.TextField()
    postcode = models.CharField(max_length=10, blank=True)

    class Meta:
        indexes = [models.Index(fields=["state"])]

    def __str__(self):
        return f"{self.name} ({self.state})"