from django.db import models
from django.conf import settings

class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resumes')
    file = models.FileField(upload_to='resumes/%Y/%m/')
    original_name = models.CharField(max_length=255)
    file_size = models.PositiveIntegerField(default=0)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self):
        return f"{self.original_name} ({self.user.email})"

class Analysis(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='analyses')
    job_title = models.CharField(max_length=150, blank=True, default='')
    job_description = models.TextField(blank=True, default='')
    overall_score = models.IntegerField(default=0)
    rating_label = models.CharField(max_length=100, default='Analyzed')
    rating_desc = models.TextField(blank=True, default='')
    
    # JSON breakdown
    section_scores = models.JSONField(default=dict)
    quick_metrics = models.JSONField(default=dict)
    extracted_data = models.JSONField(default=dict)
    matched_keywords = models.JSONField(default=list)
    missing_keywords = models.JSONField(default=list)
    match_percentage = models.FloatField(default=0.0)
    
    # Actionable items matching UI
    strengths = models.JSONField(default=list)
    areas_for_improvement = models.JSONField(default=list)
    suggestions = models.JSONField(default=list)
    pro_tips = models.TextField(blank=True, default='')

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Analysis #{self.id} for {self.resume.original_name} (Score: {self.overall_score})"
