import io
from django.test import TestCase
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from reportlab.pdfgen import canvas
from accounts.models import User
from .models import Resume, Analysis

class ResumeTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="seeker@example.com", name="Job Seeker", password="Password123")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.analyze_url = reverse('resume_analyze')
        self.list_url = reverse('analysis_list')

    def _create_sample_pdf(self):
        buf = io.BytesIO()
        p = canvas.Canvas(buf)
        p.drawString(100, 750, "Jane Seeker")
        p.drawString(100, 730, "jane@example.com | +1 555-123-4567")
        p.drawString(100, 700, "Professional Summary")
        p.drawString(100, 680, "Senior Full Stack Software Engineer with 5+ years of experience in React, Python, Django and AWS.")
        p.drawString(100, 650, "Technical Skills")
        p.drawString(100, 630, "Python, Django, React, TypeScript, PostgreSQL, Docker, AWS, Git, REST API")
        p.drawString(100, 600, "Work Experience")
        p.drawString(100, 580, "Spearheaded frontend redesign that accelerated user conversion by 42%.")
        p.drawString(100, 560, "Architected scalable microservices handling 10 million requests per day.")
        p.drawString(100, 530, "Education")
        p.drawString(100, 510, "Bachelor of Science in Computer Science - State University")
        p.save()
        buf.seek(0)
        return buf.getvalue()

    def test_resume_analysis_flow(self):
        pdf_bytes = self._create_sample_pdf()
        uploaded_file = SimpleUploadedFile(
            "sample_resume.pdf",
            pdf_bytes,
            content_type="application/pdf"
        )
        
        payload = {
            "file": uploaded_file,
            "job_title": "Senior Full Stack Engineer",
            "job_description": "We are seeking a Senior Full Stack Engineer skilled in Python, Django, React, AWS, Docker, and CI/CD pipelines."
        }
        
        response = self.client.post(self.analyze_url, payload, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('overall_score', response.data)
        self.assertIn('section_scores', response.data)
        self.assertIn('strengths', response.data)
        self.assertIn('areas_for_improvement', response.data)
        self.assertIn('quick_metrics', response.data)
        self.assertGreaterEqual(response.data['overall_score'], 70)

        # Verify listing
        list_response = self.client.get(self.list_url)
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 1)

        # Verify PDF report generation
        analysis_id = response.data['id']
        report_url = reverse('analysis_report', kwargs={'pk': analysis_id})
        report_response = self.client.get(report_url)
        self.assertEqual(report_response.status_code, status.HTTP_200_OK)
        self.assertEqual(report_response['Content-Type'], 'application/pdf')
        self.assertTrue(len(report_response.content) > 1000)
