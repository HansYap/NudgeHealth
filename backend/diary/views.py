from datetime import timedelta
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import DailyLog
from .serializers import DiaryEntryInputSerializer, DiaryEntrySerializer


class DiaryEntryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        """Full history, most recent first — one row per check-in, same-day
        entries all show up separately, matches the 'Your history' list."""
        entries = DailyLog.objects.filter(user=request.user)
        return Response(DiaryEntrySerializer(entries, many=True).data)

    def post(self, request):
        """Always creates a new entry — no same-day overwrite."""
        input_serializer = DiaryEntryInputSerializer(data=request.data)
        input_serializer.is_valid(raise_exception=True)
        data = input_serializer.validated_data

        entry = DailyLog.objects.create(
            user=request.user, feeling=data["feeling"], note=data["note"],
        )
        return Response(DiaryEntrySerializer(entry).data, status=status.HTTP_201_CREATED)


class ReassessmentCheckView(APIView):
    """Counts raw entries, not distinct days — see note above if you want
    the distinct-days version instead."""
    permission_classes = [permissions.IsAuthenticated]
    WINDOW_DAYS = 30
    THRESHOLD = 5

    def get(self, request):
        window_start = timezone.now() - timedelta(days=self.WINDOW_DAYS)
        not_great_count = DailyLog.objects.filter(
            user=request.user, feeling=DailyLog.Feeling.NOT_GREAT, logged_at__gte=window_start,
        ).count()
        return Response({
            "should_prompt_reassessment": not_great_count >= self.THRESHOLD,
            "not_great_count": not_great_count,
        })