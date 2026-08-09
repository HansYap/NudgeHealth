from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from assessments.models import RiskAssessment
from .models import DailyLog
from .serializers import DiaryEntryInputSerializer, DiaryEntrySerializer


class DiaryEntryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Full history, most recent first."""
        entries = DailyLog.objects.filter(user=request.user)
        return Response(DiaryEntrySerializer(entries, many=True).data)

    def post(self, request):
        """Always creates a new entry; no same-day overwrite."""
        input_serializer = DiaryEntryInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        entry = DailyLog.objects.create(
            user=request.user,
            feeling=data["feeling"],
            note=data["note"],
        )
        return Response(DiaryEntrySerializer(entry).data, status=status.HTTP_201_CREATED)


class ReassessmentCheckView(APIView):
    """Prompts when the five latest entries since assessment are all "Not great"."""

    permission_classes = [permissions.IsAuthenticated]
    THRESHOLD = 5

    def get(self, request):
        current_assessment = RiskAssessment.objects.filter(
            user=request.user,
            is_current=True,
        ).first()
        if not current_assessment:
            return Response(
                {
                    "should_prompt_reassessment": False,
                    "not_great_count": 0,
                }
            )

        recent_feelings = list(
            DailyLog.objects.filter(user=request.user)
            .filter(logged_at__gt=current_assessment.created_at)
            .order_by("-logged_at")
            .values_list("feeling", flat=True)[: self.THRESHOLD]
        )
        not_great_count = sum(
            1
            for feeling in recent_feelings
            if feeling == DailyLog.Feeling.NOT_GREAT
        )

        return Response(
            {
                "should_prompt_reassessment": len(recent_feelings) == self.THRESHOLD
                and not_great_count == self.THRESHOLD,
                "not_great_count": not_great_count,
            }
        )
