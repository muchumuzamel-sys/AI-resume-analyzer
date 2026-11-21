class SuggestionsGenerator:
    @classmethod
    def generate(cls, extracted_data, scores, jd_match=None):
        section_scores = scores.get("section_scores", {})
        metrics = scores.get("metrics_data", {})
        detected = extracted_data.get("detected_sections", {})
        skills = extracted_data.get("skills", [])
        has_jd = jd_match is not None and jd_match.get("match_percentage", 0) > 0
        missing_kw = jd_match.get("missing_keywords", []) if has_jd else []

        strengths = []
        improvements = []
        suggestions = []

        # 1. Strengths Detection
        if len(skills) >= 6:
            strengths.append("Strong skills section")
        if section_scores.get("experience", 0) >= 65:
            strengths.append("Good work experience")
        if section_scores.get("formatting", 0) >= 70:
            strengths.append("Clear and professional format")
        if metrics.get("quantified_hits", 0) >= 3:
            strengths.append("Contains measurable impact and metrics")
        if detected.get("certifications"):
            strengths.append("Relevant certifications included")
        if not strengths:
            strengths = ["Clear and professional format", "Foundational skills listed", "Parsable structure"]

        # Ensure at least 3 strengths matching UI style
        if len(strengths) < 3:
            for fallback in ["Clear and professional format", "Good work experience", "Strong skills section"]:
                if fallback not in strengths:
                    strengths.append(fallback)
                if len(strengths) >= 3:
                    break

        # 2. Areas for Improvement Detection
        if metrics.get("quantified_hits", 0) < 3:
            improvements.append("Add more quantified achievements")
            suggestions.append({
                "priority": "high",
                "category": "Impact",
                "text": "Add measurable achievements (e.g. 'Increased speed by 35%', 'Managed $100k budget', 'Served 10k users')."
            })

        if not detected.get("summary"):
            improvements.append("Include a summary statement")
            suggestions.append({
                "priority": "medium",
                "category": "Structure",
                "text": "Include a 2-3 sentence professional summary at the top outlining your core expertise and value proposition."
            })

        if section_scores.get("ats", 0) < 85:
            improvements.append("Improve keyword usage for ATS")
            suggestions.append({
                "priority": "high",
                "category": "ATS Optimization",
                "text": "Optimize ATS keyword density with standard industry terms and clear section headings."
            })

        if metrics.get("verb_hits", 0) < 4:
            improvements.append("Use stronger action verbs in bullet points")
            suggestions.append({
                "priority": "medium",
                "category": "Language",
                "text": "Begin each bullet point with decisive action verbs like 'Architected', 'Spearheaded', 'Optimized', or 'Orchestrated'."
            })

        if has_jd and missing_kw:
            missing_sample = ", ".join(missing_kw[:3])
            improvements.append(f"Incorporate target JD keywords ({missing_sample})")
            suggestions.append({
                "priority": "high",
                "category": "Job Match",
                "text": f"Your resume is missing key terms from the job description: {', '.join(missing_kw[:6])}. Naturally embed these into your experience points."
            })

        # Ensure at least 3 improvement items matching UI style
        default_improvements = [
            "Add more quantified achievements",
            "Include a summary statement",
            "Improve keyword usage for ATS"
        ]
        for item in default_improvements:
            if item not in improvements:
                improvements.append(item)
            if len(improvements) >= 3:
                break

        # Additional standard suggestions if needed
        if not extracted_data.get("phone"):
            suggestions.append({
                "priority": "low",
                "category": "Contact Details",
                "text": "Ensure your primary phone number is easily visible in the header."
            })

        pro_tips = "Tailor your resume with relevant keywords from the job description to increase your chances of getting hired."

        return {
            "strengths": strengths[:4],
            "areas_for_improvement": improvements[:4],
            "suggestions": suggestions,
            "pro_tips": pro_tips
        }
