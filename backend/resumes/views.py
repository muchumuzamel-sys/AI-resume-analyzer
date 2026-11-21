import os
from django.http import HttpResponse, Http404
from rest_framework import status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Resume, Analysis
from .serializers import AnalysisListSerializer, AnalysisDetailSerializer
from analyzer.parser import ResumeParser, ResumeParseException
from analyzer.extractor import ResumeExtractor
from analyzer.matcher import JobDescriptionMatcher
from analyzer.scorer import ResumeScorer
from analyzer.suggestions import SuggestionsGenerator
from reports.generator import ReportGenerator

class ResumeAnalyzeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        uploaded_file = request.FILES.get('file') or request.FILES.get('resume')
        if not uploaded_file:
            return Response(
                {"error": "Please provide a resume file (PDF or DOCX)."},
                status=status.HTTP_400_BAD_REQUEST
            )

        job_title = request.data.get('job_title', '').strip()
        job_description = request.data.get('job_description', '').strip()

        # Parse text from file
        try:
            parsed_data = ResumeParser.extract_text(uploaded_file, uploaded_file.name)
        except ResumeParseException as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": f"Failed to parse resume document: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        resume_text = parsed_data["text"]
        page_count = parsed_data["page_count"]

        # Extract structured details
        extracted_data = ResumeExtractor.extract_all(resume_text)

        # Match with Job Description (if provided)
        jd_match_result = JobDescriptionMatcher.match(resume_text, job_description)

        # Calculate Scores
        scores = ResumeScorer.calculate_scores(
            extracted_data=extracted_data,
            text=resume_text,
            page_count=page_count,
            jd_match_result=jd_match_result
        )

        # Generate Suggestions and Strengths
        suggestions_data = SuggestionsGenerator.generate(
            extracted_data=extracted_data,
            scores=scores,
            jd_match=jd_match_result
        )

        # Save to database
        uploaded_file.seek(0)
        resume_record = Resume.objects.create(
            user=request.user,
            file=uploaded_file,
            original_name=uploaded_file.name,
            file_size=uploaded_file.size
        )

        analysis_record = Analysis.objects.create(
            resume=resume_record,
            job_title=job_title,
            job_description=job_description,
            overall_score=scores["overall_score"],
            rating_label=scores["rating_label"],
            rating_desc=scores["rating_desc"],
            section_scores=scores["section_scores"],
            quick_metrics=scores["quick_metrics"],
            extracted_data=extracted_data,
            matched_keywords=jd_match_result["matched_keywords"],
            missing_keywords=jd_match_result["missing_keywords"],
            match_percentage=jd_match_result["match_percentage"],
            strengths=suggestions_data["strengths"],
            areas_for_improvement=suggestions_data["areas_for_improvement"],
            suggestions=suggestions_data["suggestions"],
            pro_tips=suggestions_data["pro_tips"]
        )

        serializer = AnalysisDetailSerializer(analysis_record)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class AnalysisListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        analyses = Analysis.objects.filter(resume__user=request.user).select_related('resume')
        serializer = AnalysisListSerializer(analyses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class AnalysisDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        try:
            return Analysis.objects.select_related('resume').get(pk=pk, resume__user=user)
        except Analysis.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        analysis = self.get_object(pk, request.user)
        serializer = AnalysisDetailSerializer(analysis)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def delete(self, request, pk):
        analysis = self.get_object(pk, request.user)
        # Delete underlying resume file as well (FR-10, NFR-10)
        resume = analysis.resume
        if resume.file:
            try:
                if os.path.isfile(resume.file.path):
                    os.remove(resume.file.path)
            except Exception:
                pass
        resume.delete()
        return Response({"message": "Analysis deleted successfully."}, status=status.HTTP_204_NO_CONTENT)


class AnalysisReportDownloadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            analysis = Analysis.objects.select_related('resume', 'resume__user').get(pk=pk, resume__user=request.user)
        except Analysis.DoesNotExist:
            raise Http404

        pdf_buffer = ReportGenerator.generate_pdf(analysis)
        filename = f"Resume_Analysis_Report_{analysis.id}.pdf"

        response = HttpResponse(pdf_buffer.getvalue(), content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="{filename}"'
        return response
