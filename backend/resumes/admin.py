from django.contrib import admin
from .models import Resume, Analysis

@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ('id', 'original_name', 'user', 'file_size', 'uploaded_at')
    search_fields = ('original_name', 'user__email', 'user__name')
    list_filter = ('uploaded_at',)

@admin.register(Analysis)
class AnalysisAdmin(admin.ModelAdmin):
    list_display = ('id', 'resume', 'overall_score', 'rating_label', 'match_percentage', 'created_at')
    search_fields = ('resume__original_name', 'job_title', 'resume__user__email')
    list_filter = ('rating_label', 'created_at')
