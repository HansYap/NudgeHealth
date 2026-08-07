from rest_framework import serializers
from .models import RiskAssessment, ActionPlanItem


class AssessmentInputSerializer(serializers.Serializer):
    """Plain Serializer, not ModelSerializer — the raw answers get processed
    by ScoreEngine before anything is saved, so there's no direct .create()."""
    trigger_reason = serializers.ChoiceField(choices=RiskAssessment.TRIGGER_CHOICES)

    age = serializers.IntegerField(min_value=0, max_value=120)
    sex = serializers.ChoiceField(choices=RiskAssessment.SEX_CHOICES)
    state = serializers.CharField(max_length=40)

    smoking_status = serializers.ChoiceField(choices=RiskAssessment.SMOKING_CHOICES)
    height_cm = serializers.DecimalField(max_digits=5, decimal_places=1, min_value=50, max_value=250)
    weight_kg = serializers.DecimalField(max_digits=5, decimal_places=1, min_value=20, max_value=300)
    activity_level = serializers.ChoiceField(choices=RiskAssessment.ACTIVITY_CHOICES)

    high_sodium = serializers.BooleanField(default=False)
    low_fruit_veg = serializers.BooleanField(default=False)
    screened_past_2yrs = serializers.BooleanField(default=True)
    has_diabetes = serializers.BooleanField(default=False)
    has_hypertension = serializers.BooleanField(default=False)
    has_high_cholesterol = serializers.BooleanField(default=False)


class ActionPlanItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActionPlanItem
        fields = [
            "id", "rule_code", "title_en", "title_ms", "detail_en", "detail_ms",
            "requires_clinic_visit", "target_facility_type",
            "is_priority_ranked", "priority_rank",
        ]


class RiskAssessmentSerializer(serializers.ModelSerializer):
    action_items = ActionPlanItemSerializer(many=True, read_only=True)

    class Meta:
        model = RiskAssessment
        # calculation_trace is deliberately NOT listed here — allowlist, not "__all__"
        fields = [
            "id", "created_at", "trigger_reason",
            "modifiable_lifestyle_score", "risk_band", "score_factors",
            "action_items",
        ]