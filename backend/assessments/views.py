from django.db import transaction
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from scoring.engine import ScoreEngine
from .models import ActionPlanItem, RiskAssessment
from .recommendation_engine import RecommendationEngine
from .serializers import AssessmentInputSerializer, RiskAssessmentSerializer


class SubmitAssessmentView(APIView):
    """Handles onboarding, manual retake, AND diary-triggered retake — all
    the same form, distinguished only by the trigger_reason field sent in."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        input_serializer = AssessmentInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        score_result = ScoreEngine.calculate(
            age=data["age"], sex=data["sex"], state=data["state"],
            smoking_status=data["smoking_status"],
            height_cm=data["height_cm"], weight_kg=data["weight_kg"],
            activity_level=data["activity_level"],
        )

        with transaction.atomic():
            # flip the old current row off FIRST — never two True rows at once
            RiskAssessment.objects.filter(user=request.user, is_current=True).update(is_current=False)

            assessment = RiskAssessment.objects.create(
                user=request.user, is_current=True, trigger_reason=data["trigger_reason"],
                age=data["age"], sex=data["sex"], state=data["state"],
                smoking_status=data["smoking_status"],
                height_cm=data["height_cm"], weight_kg=data["weight_kg"],
                bmi_category=score_result.bmi_category,
                activity_level=data["activity_level"],
                high_sodium=data["high_sodium"], low_fruit_veg=data["low_fruit_veg"],
                screened_past_2yrs=data["screened_past_2yrs"],
                has_diabetes=data["has_diabetes"], has_hypertension=data["has_hypertension"],
                has_high_cholesterol=data["has_high_cholesterol"],
                modifiable_lifestyle_score=score_result.modifiable_lifestyle_score,
                risk_band=score_result.risk_band,
                score_factors=score_result.score_factors,
                calculation_trace=score_result.calculation_trace,
            )

            items = RecommendationEngine.generate(
                assessment,
                delta_yll_smoking=score_result.delta_yll_smoking,
                delta_yll_activity_bmi=score_result.delta_yll_activity_bmi,
            )
            ActionPlanItem.objects.bulk_create(items)

        assessment.refresh_from_db()
        return Response(RiskAssessmentSerializer(assessment).data, status=status.HTTP_201_CREATED)


class CurrentAssessmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        assessment = RiskAssessment.objects.filter(user=request.user, is_current=True).first()
        if not assessment:
            return Response({"detail": "No assessment yet."}, status=status.HTTP_404_NOT_FOUND)
        return Response(RiskAssessmentSerializer(assessment).data)


class AssessmentHistoryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        assessments = RiskAssessment.objects.filter(user=request.user)
        return Response(RiskAssessmentSerializer(assessments, many=True).data)