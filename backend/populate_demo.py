import os
import io
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.core.files.base import ContentFile
from accounts.models import User
from resumes.models import Resume, Analysis
from reportlab.pdfgen import canvas

def create_demo_data():
    user, _ = User.objects.get_or_create(
        email='demo@example.com',
        defaults={'name': 'Alex Taylor'}
    )
    user.set_password('Password123')
    user.save()

    # Create dummy PDF file
    buf = io.BytesIO()
    p = canvas.Canvas(buf)
    p.drawString(100, 750, "Alex Taylor - Senior Full Stack Engineer")
    p.drawString(100, 730, "alex.taylor@example.com | (555) 234-5678 | San Francisco, CA")
    p.drawString(100, 700, "PROFESSIONAL SUMMARY")
    p.drawString(100, 680, "Results-driven Software Engineer with 6+ years specializing in Python, Django, React, and Cloud Architecture.")
    p.drawString(100, 650, "TECHNICAL SKILLS")
    p.drawString(100, 630, "Python, Django, React, TypeScript, PostgreSQL, Docker, AWS, Kubernetes, Git, REST API, GraphQL")
    p.drawString(100, 600, "PROFESSIONAL EXPERIENCE")
    p.drawString(100, 580, "Senior Software Engineer - TechCorp Inc. (2021 - Present)")
    p.drawString(100, 560, "- Spearheaded architectural redesign improving API response time by 45%.")
    p.drawString(100, 540, "- Managed cloud infrastructure migration to AWS saving $85,000 annually.")
    p.drawString(100, 520, "- Mentored 8 junior engineers and established automated CI/CD testing pipelines.")
    p.drawString(100, 490, "EDUCATION")
    p.drawString(100, 470, "B.S. in Computer Science - University of California, Berkeley")
    p.save()
    buf.seek(0)

    # Clean existing demo analyses if any
    Resume.objects.filter(user=user).delete()

    resume = Resume.objects.create(
        user=user,
        file=ContentFile(buf.getvalue(), name="Alex_Taylor_Resume.pdf"),
        original_name="Alex_Taylor_Resume.pdf",
        file_size=len(buf.getvalue())
    )

    analysis = Analysis.objects.create(
        resume=resume,
        job_title="Senior Full Stack Software Engineer",
        job_description="Seeking a Senior Full Stack Engineer with expertise in React, Python, Django, AWS, Docker, REST API, and microservices architecture.",
        overall_score=92,
        rating_label="Excellent Resume!",
        rating_desc="Your resume is well-optimized. Just a few improvements can make it even better.",
        section_scores={
            "ats": 94,
            "skills": 92,
            "experience": 90,
            "education": 95,
            "formatting": 88
        },
        quick_metrics={
            "ats_friendly": "Yes",
            "readability": "Excellent",
            "skills_match": "92%",
            "estimated_match": "95%"
        },
        extracted_data={
            "name": "Alex Taylor",
            "email": "alex.taylor@example.com",
            "phone": "(555) 234-5678",
            "skills": [
                "Python", "Django", "React", "TypeScript", "PostgreSQL",
                "Docker", "AWS", "Kubernetes", "Git", "REST API", "GraphQL"
            ],
            "education": ["B.S. in Computer Science - University of California, Berkeley"],
            "experience": ["Senior Software Engineer - TechCorp Inc."],
            "detected_sections": {
                "summary": True,
                "experience": True,
                "education": True,
                "skills": True,
                "projects": False,
                "certifications": False
            }
        },
        matched_keywords=["python", "django", "react", "aws", "docker", "rest api"],
        missing_keywords=["ci/cd", "microservices"],
        match_percentage=94.5,
        strengths=[
            "Strong skills section",
            "Good work experience",
            "Clear and professional format"
        ],
        areas_for_improvement=[
            "Add more quantified achievements",
            "Include a summary statement",
            "Improve keyword usage for ATS"
        ],
        suggestions=[
            {
                "priority": "high",
                "category": "Impact",
                "text": "Add more quantified achievements (e.g., metric increases, $ savings, or percentage growth)."
            },
            {
                "priority": "medium",
                "category": "Structure",
                "text": "Include a concise 2-3 sentence executive summary tailored directly to target roles."
            },
            {
                "priority": "high",
                "category": "ATS Optimization",
                "text": "Improve keyword usage for ATS: embed keywords like 'CI/CD' and 'Microservices' in your bullet points."
            }
        ],
        pro_tips="Tailor your resume with relevant keywords from the job description to increase your chances of getting hired."
    )

    print(f"Demo analysis #{analysis.id} created successfully for {user.email} (Overall Score: {analysis.overall_score}%)")

if __name__ == '__main__':
    create_demo_data()
