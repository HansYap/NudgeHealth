from django.urls import path
from .views import AssessmentHistoryView, CurrentAssessmentView, SubmitAssessmentView

urlpatterns = [
    path("", SubmitAssessmentView.as_view()),
    path("current/", CurrentAssessmentView.as_view()),
    path("history/", AssessmentHistoryView.as_view()),
]