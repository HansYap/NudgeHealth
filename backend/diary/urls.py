from django.urls import path
from .views import DiaryEntryView, ReassessmentCheckView

urlpatterns = [
    path("", DiaryEntryView.as_view()),
    path("reassessment-check/", ReassessmentCheckView.as_view()),
]