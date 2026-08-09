from rest_framework import serializers
from .models import DailyLog


class DiaryEntryInputSerializer(serializers.Serializer):
    feeling = serializers.ChoiceField(choices=DailyLog.Feeling.choices)
    note = serializers.CharField(required=False, allow_blank=True, default="")


class DiaryEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyLog
        fields = ["id", "feeling", "note", "logged_at"]