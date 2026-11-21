import re
import math
from collections import Counter
import numpy as np

STOPWORDS = {
    "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
    "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
    "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
    "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
    "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
    "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into",
    "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
    "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our",
    "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's",
    "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs",
    "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
    "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
    "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
    "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't",
    "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
    "yourselves", "will", "shall", "work", "experience", "candidate", "job", "role", "requirements",
    "responsibilities", "years", "looking", "ability", "strong", "team", "must", "plus", "preferred"
}

class JobDescriptionMatcher:
    @classmethod
    def tokenize(cls, text):
        # Extract word and technology tokens (including c++, node.js, c#, etc.)
        tokens = re.findall(r'[a-zA-Z0-9+#.-]+', text.lower())
        cleaned = []
        for t in tokens:
            t_clean = t.strip('.-')
            if len(t_clean) >= 2 and t_clean not in STOPWORDS and not t_clean.isdigit():
                cleaned.append(t_clean)
        return cleaned

    @classmethod
    def match(cls, resume_text, jd_text):
        if not jd_text or not jd_text.strip():
            return {
                "match_percentage": 0.0,
                "matched_keywords": [],
                "missing_keywords": []
            }

        resume_tokens = cls.tokenize(resume_text)
        jd_tokens = cls.tokenize(jd_text)

        if not jd_tokens or not resume_tokens:
            return {
                "match_percentage": 0.0,
                "matched_keywords": [],
                "missing_keywords": []
            }

        # Count frequencies
        jd_freq = Counter(jd_tokens)
        resume_set = set(resume_tokens)

        # Matched & missing keywords based on top keywords in JD
        top_jd_keywords = [word for word, count in jd_freq.most_common(40)]

        matched_keywords = [w for w in top_jd_keywords if w in resume_set]
        missing_keywords = [w for w in top_jd_keywords if w not in resume_set]

        # TF-IDF Cosine Similarity Calculation
        vocabulary = list(set(resume_tokens + jd_tokens))
        vocab_index = {word: i for i, word in enumerate(vocabulary)}

        # Document frequencies
        df = Counter()
        for doc_set in [set(resume_tokens), set(jd_tokens)]:
            for word in doc_set:
                df[word] += 1

        N = 2
        idf = {word: math.log((1 + N) / (1 + df[word])) + 1 for word in vocabulary}

        # Vector creation
        def make_vector(tokens):
            counts = Counter(tokens)
            total = len(tokens)
            vec = np.zeros(len(vocabulary), dtype=np.float64)
            for word, cnt in counts.items():
                if word in vocab_index:
                    tf = cnt / total
                    vec[vocab_index[word]] = tf * idf[word]
            return vec

        vec_resume = make_vector(resume_tokens)
        vec_jd = make_vector(jd_tokens)

        norm_resume = np.linalg.norm(vec_resume)
        norm_jd = np.linalg.norm(vec_jd)

        if norm_resume > 0 and norm_jd > 0:
            cosine_sim = float(np.dot(vec_resume, vec_jd) / (norm_resume * norm_jd))
        else:
            cosine_sim = 0.0

        # Also calculate keyword overlap ratio
        overlap_ratio = len(matched_keywords) / max(len(top_jd_keywords), 1)

        # Blended match percentage (0-100)
        match_score = (cosine_sim * 0.45 + overlap_ratio * 0.55) * 100
        match_score = round(min(100.0, max(15.0, match_score)), 1)

        return {
            "match_percentage": match_score,
            "matched_keywords": matched_keywords[:15],
            "missing_keywords": missing_keywords[:12]
        }
