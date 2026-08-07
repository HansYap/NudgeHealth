from django.conf import settings
from django.db import models


class RiskAssessment(models.Model):
    TRIGGER_CHOICES = [
        ("onboarding", "Onboarding"),
        ("manual_retake", "Manual Retake"),
        ("diary_flagged", "Diary Flagged"),
    ]
    RISK_BAND_CHOICES = [("low", "Low Risk"), ("moderate", "Moderate Risk"), ("high", "High Risk")]
    SEX_CHOICES = [("M", "Male"), ("F", "Female")]
    SMOKING_CHOICES = [
        ("never", "Never smoked"),
        ("former_5plus_years", "Former smoker, quit 5+ years ago"),
        ("former_under_5_years", "Former smoker, quit under 5 years ago"),
        ("current", "Current smoker"),
    ]
    ACTIVITY_CHOICES = [("inactive", "Inactive"), ("active", "Active")]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="assessments")
    is_current = models.BooleanField(default=True)
    trigger_reason = models.CharField(max_length=30, choices=TRIGGER_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    # Q1-3 — feed both pipelines
    age = models.PositiveSmallIntegerField()
    sex = models.CharField(max_length=1, choices=SEX_CHOICES)
    state = models.CharField(max_length=40)

    # Q4-6 — feed both pipelines
    smoking_status = models.CharField(max_length=25, choices=SMOKING_CHOICES)
    height_cm = models.DecimalField(max_digits=5, decimal_places=1)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=1)
    bmi_category = models.CharField(max_length=20)   # computed by ScoreEngine, stored for reference
    activity_level = models.CharField(max_length=10, choices=ACTIVITY_CHOICES)

    # Q7-9 — Pipeline 2 only
    high_sodium = models.BooleanField(default=False)
    low_fruit_veg = models.BooleanField(default=False)
    screened_past_2yrs = models.BooleanField(default=True)
    has_diabetes = models.BooleanField(default=False)
    has_hypertension = models.BooleanField(default=False)
    has_high_cholesterol = models.BooleanField(default=False)

    # outputs — public, safe to serialize
    modifiable_lifestyle_score = models.PositiveSmallIntegerField()
    risk_band = models.CharField(max_length=10, choices=RISK_BAND_CHOICES)
    score_factors = models.JSONField()

    # output — internal only, NEVER put this in a public serializer
    calculation_trace = models.JSONField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user"], condition=models.Q(is_current=True), name="one_current_assessment_per_user"
            )
        ]
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.email} — {self.risk_band} ({self.created_at.date()})"


class ActionPlanItem(models.Model):
    assessment = models.ForeignKey(RiskAssessment, on_delete=models.CASCADE, related_name="action_items")
    rule_code = models.CharField(max_length=40)
    title_en = models.CharField(max_length=200)
    title_ms = models.CharField(max_length=200)
    detail_en = models.TextField()
    detail_ms = models.TextField()
    requires_clinic_visit = models.BooleanField(default=False)
    target_facility_type = models.CharField(max_length=50, blank=True)

    # only True for the smoking item and the bmi/activity item — the two
    # backed by an actual delta_YLL number. Everything else stays False/null.
    is_priority_ranked = models.BooleanField(default=False)
    priority_rank = models.PositiveSmallIntegerField(null=True, blank=True)  # 1 = biggest YLL cost

    class Meta:
        ordering = ["priority_rank", "id"]   # ranked items first (nulls last), stable order otherwise

    def __str__(self):
        return f"{self.rule_code} ({self.assessment_id})"