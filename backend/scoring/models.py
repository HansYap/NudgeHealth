from django.db import models

class DosmLifeExpectancy(models.Model):
    """One row per (age band, sex, state). Loaded from a DOSM CSV via a
    management command — never edited by hand, never touched by users."""

    SEX_CHOICES = [("M", "Male"), ("F", "Female")]

    age_band = models.PositiveSmallIntegerField()  # 0, 1, 5, 10, ..., 80 — see note above
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    state = models.CharField(max_length=40)
    e_x = models.DecimalField(max_digits=5, decimal_places=1)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["age_band", "sex", "state"], name="unique_dosm_row")
        ]

    def __str__(self):
        return f"{self.state} / {self.sex} / age {self.age_band}: e_x={self.e_x}"