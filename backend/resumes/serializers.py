from rest_framework import serializers
from .models import Resume, Analysis

class AnalysisListSerializer(serializers.ModelSerializer):
    original_name = serializers.CharField(source='resume.original_name', read_only=True)
    file_url = serializers.CharField(source='resume.file.url', read_only=True)

    class Meta:
        model = Analysis
        fields = (
            'id', 'original_name', 'file_url', 'job_title',
            'overall_score', 'rating_label', 'created_at',
            'match_percentage', 'quick_metrics'
        )

class AnalysisDetailSerializer(serializers.ModelSerializer):
    original_name = serializers.CharField(source='resume.original_name', read_only=True)
    file_url = serializers.CharField(source='resume.file.url', read_only=True)
    uploaded_at = serializers.DateTimeField(source='resume.uploaded_at', read_only=True)

    class Meta:
        model = Analysis
        fields = (
            'id', 'original_name', 'file_url', 'uploaded_at',
            'job_title', 'job_description',
            'overall_score', 'rating_label', 'rating_desc',
            'section_scores', 'quick_metrics', 'extracted_data',
            'matched_keywords', 'missing_keywords', 'match_percentage',
            'strengths', 'areas_for_improvement', 'suggestions',
            'pro_tips', 'created_at'
        )
