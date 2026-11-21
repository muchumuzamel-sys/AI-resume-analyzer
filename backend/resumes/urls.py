from django.urls import path
from .views import (
    ResumeAnalyzeView,
    AnalysisListView,
    AnalysisDetailView,
    AnalysisReportDownloadView
)

urlpatterns = [
    path('analyze/', ResumeAnalyzeView.as_view(), name='resume_analyze'),
    path('', AnalysisListView.as_view(), name='analysis_list'),
    path('<int:pk>/', AnalysisDetailView.as_view(), name='analysis_detail'),
    path('<int:pk>/report/', AnalysisReportDownloadView.as_view(), name='analysis_report'),
]
