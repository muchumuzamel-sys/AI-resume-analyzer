import re

ACTION_VERBS = [
    "accelerated", "achieved", "analyzed", "architected", "automated", "built", "collaborated",
    "coordinated", "created", "decreased", "delivered", "deployed", "designed", "developed",
    "engineered", "established", "executed", "expanded", "formulated", "generated", "implemented",
    "improved", "increased", "initiated", "integrated", "launched", "led", "managed", "maximized",
    "mentored", "negotiated", "optimized", "orchestrated", "overhauled", "pioneered", "reduced",
    "resolved", "restructured", "scaled", "simplified", "spearheaded", "standardized", "streamlined",
    "supervised", "transformed", "upgraded"
]

class ResumeScorer:
    @classmethod
    def calculate_scores(cls, extracted_data, text, page_count=1, jd_match_result=None):
        has_jd = jd_match_result is not None and jd_match_result.get("match_percentage", 0) > 0
        match_pct = jd_match_result.get("match_percentage", 0.0) if has_jd else 0.0

        # 1. ATS Compatibility & Formatting (Base 100)
        ats_score = 65
        sections = extracted_data.get("detected_sections", {})
        if sections.get("experience"): ats_score += 10
        if sections.get("skills"): ats_score += 10
        if sections.get("education"): ats_score += 10
        if sections.get("summary"): ats_score += 5
        if extracted_data.get("email"): ats_score += 5
        if extracted_data.get("phone"): ats_score += 5
        
        # Penalties: excessive page count
        if page_count > 2:
            ats_score -= 15
        elif page_count == 0:
            ats_score -= 10
        ats_score = min(100, max(25, ats_score))

        # 2. Formatting Score
        formatting_score = 80
        # Check bullet points or list markers
        bullet_count = len(re.findall(r'^[•\-\*]\s+', text, re.M))
        if bullet_count >= 5:
            formatting_score += 10
        if page_count in (1, 2):
            formatting_score += 10
        if page_count > 3:
            formatting_score -= 20
        formatting_score = min(100, max(30, formatting_score))

        # 3. Skills Relevance (Base 100)
        skills = extracted_data.get("skills", [])
        num_skills = len(skills)
        if num_skills >= 12:
            skills_score = 94
        elif num_skills >= 8:
            skills_score = 86
        elif num_skills >= 5:
            skills_score = 75
        elif num_skills >= 2:
            skills_score = 60
        else:
            skills_score = 40

        if has_jd:
            # Factor in matched keywords ratio
            matched_count = len(jd_match_result.get("matched_keywords", []))
            if matched_count >= 5:
                skills_score = min(100, skills_score + 6)
            elif matched_count <= 2:
                skills_score = max(30, skills_score - 10)

        # 4. Experience Quality (Action verbs & quantified achievements)
        text_lower = text.lower()
        verb_hits = sum(1 for verb in ACTION_VERBS if re.search(r'\b' + verb + r'\b', text_lower))
        
        # Quantified metrics (e.g. 20%, $50k, 10x, 50+ users)
        quantified_hits = len(re.findall(r'(\d+[\d,.]*\s*(?:%|\+|k|m|million|billion|users|clients|projects|times|x)|\$\d+)', text_lower))

        exp_score = 50
        if verb_hits >= 6:
            exp_score += 25
        elif verb_hits >= 3:
            exp_score += 15
        elif verb_hits >= 1:
            exp_score += 10

        if quantified_hits >= 5:
            exp_score += 25
        elif quantified_hits >= 2:
            exp_score += 15
        elif quantified_hits >= 1:
            exp_score += 8
        exp_score = min(100, max(20, exp_score))

        # 5. Education & Certifications
        education = extracted_data.get("education", [])
        has_certs = sections.get("certifications", False)
        edu_score = 65
        if education:
            edu_score += 25
        if has_certs:
            edu_score += 10
        edu_score = min(100, max(30, edu_score))

        # 6. Overall Weighted Score Calculation
        if has_jd:
            # ATS 20%, Formatting 10%, Skills 25%, Experience 20%, Education 10%, JD Match 15%
            overall = (
                ats_score * 0.20 +
                formatting_score * 0.10 +
                skills_score * 0.25 +
                exp_score * 0.20 +
                edu_score * 0.10 +
                match_pct * 0.15
            )
        else:
            # Redistributed when no JD supplied: ATS 25%, Skills 25%, Experience 25%, Formatting 15%, Education 10%
            overall = (
                ats_score * 0.25 +
                skills_score * 0.25 +
                exp_score * 0.25 +
                formatting_score * 0.15 +
                edu_score * 0.10
            )

        overall = int(round(overall))
        overall = min(99, max(20, overall))

        # Rating label & description
        if overall >= 85:
            rating_label = "Excellent Resume!"
            rating_desc = "Your resume is well-optimized. Just a few improvements can make it even better."
        elif overall >= 70:
            rating_label = "Good Resume!"
            rating_desc = "Solid resume with good experience and skills. A few tweaks can boost your ATS ranking."
        elif overall >= 50:
            rating_label = "Fair Resume"
            rating_desc = "Your resume covers basic foundations but needs key improvements in formatting and metrics."
        else:
            rating_label = "Needs Improvement"
            rating_desc = "Significant gaps detected in ATS formatting, quantifiable results, and technical keywords."

        # Quick Metrics (matching the UI dashboard cards)
        ats_friendly = "Yes" if ats_score >= 70 else "Needs Review"
        readability = "Excellent" if formatting_score >= 85 else ("Good" if formatting_score >= 65 else "Fair")
        skills_match_display = f"{skills_score}%"
        estimated_match_display = f"{max(80, min(98, int(overall + 3)))}%"

        return {
            "overall_score": overall,
            "rating_label": rating_label,
            "rating_desc": rating_desc,
            "section_scores": {
                "ats": ats_score,
                "skills": skills_score,
                "experience": exp_score,
                "education": edu_score,
                "formatting": formatting_score
            },
            "quick_metrics": {
                "ats_friendly": ats_friendly,
                "readability": readability,
                "skills_match": skills_match_display,
                "estimated_match": estimated_match_display
            },
            "metrics_data": {
                "verb_hits": verb_hits,
                "quantified_hits": quantified_hits,
                "page_count": page_count
            }
        }
