import io
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_footer(num_pages)
            super().showPage()
        super().save()

    def draw_footer(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 9)
        self.setFillColor(colors.HexColor("#64748b"))
        footer_text = f"AI Resume Analyzer • Confidential Evaluation Report • Page {self._pageNumber} of {page_count}"
        self.drawCentredString(letter[0] / 2.0, 30, footer_text)
        self.restoreState()


class ReportGenerator:
    @classmethod
    def generate_pdf(cls, analysis):
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=40,
            leftMargin=40,
            topMargin=40,
            bottomMargin=50
        )

        styles = getSampleStyleSheet()

        # Custom Palette
        c_primary = colors.HexColor("#4338ca")       # Indigo
        c_dark = colors.HexColor("#0f172a")          # Slate 900
        c_emerald = colors.HexColor("#059669")       # Green
        c_red = colors.HexColor("#dc2626")           # Red
        c_bg_light = colors.HexColor("#f8fafc")      # Light Slate
        c_border = colors.HexColor("#e2e8f0")

        # Custom Typography
        title_style = ParagraphStyle(
            'ReportTitle',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=22,
            leading=26,
            textColor=c_primary
        )

        subtitle_style = ParagraphStyle(
            'ReportSubtitle',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#475569")
        )

        h2_style = ParagraphStyle(
            'SectionH2',
            parent=styles['Normal'],
            fontName='Helvetica-Bold',
            fontSize=13,
            leading=17,
            textColor=c_dark,
            spaceBefore=12,
            spaceAfter=6
        )

        body_style = ParagraphStyle(
            'Body',
            parent=styles['Normal'],
            fontName='Helvetica',
            fontSize=9.5,
            leading=13.5,
            textColor=colors.HexColor("#334155")
        )

        bold_style = ParagraphStyle(
            'BodyBold',
            parent=body_style,
            fontName='Helvetica-Bold'
        )

        story = []

        # Header Title
        story.append(Paragraph("AI Resume Analyzer", title_style))
        story.append(Paragraph("Comprehensive Resume & ATS Evaluation Report", subtitle_style))
        story.append(Spacer(1, 10))
        story.append(HRFlowable(width="100%", thickness=1.5, color=c_primary, spaceBefore=4, spaceAfter=14))

        # Overview Table
        extracted = analysis.extracted_data or {}
        name = extracted.get("name") or "Candidate"
        email = extracted.get("email") or "Not detected"
        phone = extracted.get("phone") or "Not detected"
        created_str = analysis.created_at.strftime("%B %d, %Y - %H:%M UTC")

        overview_data = [
            [
                Paragraph("<b>Candidate Name:</b>", body_style),
                Paragraph(name, body_style),
                Paragraph("<b>Analysis Date:</b>", body_style),
                Paragraph(created_str, body_style)
            ],
            [
                Paragraph("<b>Email:</b>", body_style),
                Paragraph(email, body_style),
                Paragraph("<b>Resume File:</b>", body_style),
                Paragraph(analysis.resume.original_name, body_style)
            ],
            [
                Paragraph("<b>Phone:</b>", body_style),
                Paragraph(phone, body_style),
                Paragraph("<b>Target Role:</b>", body_style),
                Paragraph(analysis.job_title or "General Evaluation", body_style)
            ],
        ]

        overview_table = Table(overview_data, colWidths=[95, 170, 90, 175])
        overview_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), c_bg_light),
            ('BOX', (0,0), (-1,-1), 1, c_border),
            ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
            ('LEFTPADDING', (0,0), (-1,-1), 8),
            ('RIGHTPADDING', (0,0), (-1,-1), 8),
        ]))
        story.append(overview_table)
        story.append(Spacer(1, 14))

        # Overall Score & Quick Metrics
        score = analysis.overall_score
        qm = analysis.quick_metrics or {}
        score_cell = f"<font size='26'><b>{score}%</b></font><br/><font size='10' color='#4338ca'><b>{analysis.rating_label}</b></font>"

        metrics_data = [
            [
                Paragraph(score_cell, ParagraphStyle('ScoreCell', alignment=1, leading=26)),
                Paragraph(f"<b>ATS Friendly:</b> <font color='#059669'>{qm.get('ats_friendly', 'Yes')}</font><br/>"
                          f"<b>Readability:</b> <font color='#059669'>{qm.get('readability', 'Excellent')}</font>", body_style),
                Paragraph(f"<b>Skills Match:</b> <font color='#059669'>{qm.get('skills_match', '92%')}</font><br/>"
                          f"<b>Estimated Match:</b> <font color='#059669'>{qm.get('estimated_match', '95%')}</font>", body_style),
            ]
        ]
        metrics_table = Table(metrics_data, colWidths=[160, 185, 185])
        metrics_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#eff6ff")),
            ('BOX', (0,0), (-1,-1), 1.2, colors.HexColor("#bfdbfe")),
            ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(metrics_table)
        story.append(Spacer(1, 12))

        # Section Scores Breakdown
        sec_scores = analysis.section_scores or {}
        story.append(Paragraph("Section-Wise Performance Scores", h2_style))
        scores_row = [
            [
                Paragraph("<b>ATS Compatibility</b>", body_style),
                Paragraph("<b>Skills Relevance</b>", body_style),
                Paragraph("<b>Experience Quality</b>", body_style),
                Paragraph("<b>Education & Certs</b>", body_style),
                Paragraph("<b>Formatting</b>", body_style)
            ],
            [
                Paragraph(f"<font size='12' color='#4338ca'><b>{sec_scores.get('ats', 0)}%</b></font>", body_style),
                Paragraph(f"<font size='12' color='#4338ca'><b>{sec_scores.get('skills', 0)}%</b></font>", body_style),
                Paragraph(f"<font size='12' color='#4338ca'><b>{sec_scores.get('experience', 0)}%</b></font>", body_style),
                Paragraph(f"<font size='12' color='#4338ca'><b>{sec_scores.get('education', 0)}%</b></font>", body_style),
                Paragraph(f"<font size='12' color='#4338ca'><b>{sec_scores.get('formatting', 0)}%</b></font>", body_style)
            ]
        ]
        sec_table = Table(scores_row, colWidths=[106, 106, 106, 106, 106])
        sec_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#f1f5f9")),
            ('BACKGROUND', (0,1), (-1,1), colors.white),
            ('BOX', (0,0), (-1,-1), 1, c_border),
            ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('TOPPADDING', (0,0), (-1,-1), 6),
            ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ]))
        story.append(sec_table)
        story.append(Spacer(1, 14))

        # Strengths & Areas for Improvement (Two Column Box)
        story.append(Paragraph("Key Assessment Highlights", h2_style))
        
        strengths_p = ["<b>Key Strengths:</b><br/>"]
        for s in (analysis.strengths or []):
            strengths_p.append(f"• <font color='#059669'>✓</font> {s}")
        
        improv_p = ["<b>Areas for Improvement:</b><br/>"]
        for a in (analysis.areas_for_improvement or []):
            improv_p.append(f"• <font color='#dc2626'>!</font> {a}")

        highlight_data = [
            [
                Paragraph("<br/>".join(strengths_p), body_style),
                Paragraph("<br/>".join(improv_p), body_style)
            ]
        ]
        hl_table = Table(highlight_data, colWidths=[260, 270])
        hl_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (0,0), colors.HexColor("#ecfdf5")),
            ('BACKGROUND', (1,0), (1,0), colors.HexColor("#fef2f2")),
            ('BOX', (0,0), (0,0), 1, colors.HexColor("#a7f3d0")),
            ('BOX', (1,0), (1,0), 1, colors.HexColor("#fecaca")),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
            ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ]))
        story.append(hl_table)
        story.append(Spacer(1, 14))

        # Extracted Skills
        skills = extracted.get("skills", [])
        if skills:
            story.append(Paragraph("Detected Technical & Professional Skills", h2_style))
            skills_str = ", ".join(skills)
            skills_box = Table([[Paragraph(skills_str, body_style)]], colWidths=[530])
            skills_box.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
                ('BOX', (0,0), (-1,-1), 1, c_border),
                ('TOPPADDING', (0,0), (-1,-1), 8),
                ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                ('LEFTPADDING', (0,0), (-1,-1), 10),
                ('RIGHTPADDING', (0,0), (-1,-1), 10),
            ]))
            story.append(skills_box)
            story.append(Spacer(1, 14))

        # Job Description Keyword Matching
        if analysis.job_description:
            story.append(Paragraph(f"Target Job Description Matching ({analysis.match_percentage}% Match)", h2_style))
            matched_str = ", ".join(analysis.matched_keywords or ["None"])
            missing_str = ", ".join(analysis.missing_keywords or ["None"])
            
            jd_box_data = [
                [
                    Paragraph(f"<b>Matched Keywords:</b><br/><font color='#059669'>{matched_str}</font>", body_style),
                    Paragraph(f"<b>Missing Target Keywords:</b><br/><font color='#dc2626'>{missing_str}</font>", body_style)
                ]
            ]
            jd_table = Table(jd_box_data, colWidths=[260, 270])
            jd_table.setStyle(TableStyle([
                ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
                ('BOX', (0,0), (-1,-1), 1, c_border),
                ('TOPPADDING', (0,0), (-1,-1), 8),
                ('BOTTOMPADDING', (0,0), (-1,-1), 8),
                ('LEFTPADDING', (0,0), (-1,-1), 10),
                ('RIGHTPADDING', (0,0), (-1,-1), 10),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ]))
            story.append(jd_table)
            story.append(Spacer(1, 14))

        # AI Recommendations
        suggestions = analysis.suggestions or []
        if suggestions:
            story.append(Paragraph("Actionable Improvement Recommendations", h2_style))
            sugg_rows = []
            for item in suggestions[:6]:
                prio = item.get("priority", "medium").upper()
                prio_color = "#dc2626" if prio == "HIGH" else ("#d97706" if prio == "MEDIUM" else "#2563eb")
                text = item.get("text", "")
                cat = item.get("category", "General")
                sugg_rows.append([
                    Paragraph(f"<font color='{prio_color}'><b>[{prio}]</b></font><br/><font size='8' color='#64748b'>{cat}</font>", body_style),
                    Paragraph(text, body_style)
                ])
            
            if sugg_rows:
                sugg_table = Table(sugg_rows, colWidths=[80, 450])
                sugg_table.setStyle(TableStyle([
                    ('BOX', (0,0), (-1,-1), 1, c_border),
                    ('INNERGRID', (0,0), (-1,-1), 0.5, c_border),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                    ('LEFTPADDING', (0,0), (-1,-1), 8),
                    ('RIGHTPADDING', (0,0), (-1,-1), 8),
                    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
                ]))
                story.append(sugg_table)
                story.append(Spacer(1, 14))

        # Pro Tips
        pro_tips = analysis.pro_tips or "Tailor your resume with relevant keywords from the job description to increase your chances of getting hired."
        tips_data = [[
            Paragraph(f"💡 <b>Pro Tip:</b> {pro_tips}", body_style)
        ]]
        tips_table = Table(tips_data, colWidths=[530])
        tips_table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f5f3ff")),
            ('BOX', (0,0), (-1,-1), 1.2, colors.HexColor("#ddd6fe")),
            ('TOPPADDING', (0,0), (-1,-1), 8),
            ('BOTTOMPADDING', (0,0), (-1,-1), 8),
            ('LEFTPADDING', (0,0), (-1,-1), 10),
            ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ]))
        story.append(tips_table)

        doc.build(story, canvasmaker=NumberedCanvas)
        buffer.seek(0)
        return buffer
