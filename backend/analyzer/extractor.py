import re

# Comprehensive curated skills catalog
CURATED_SKILLS = [
    # Programming Languages
    "Python", "JavaScript", "TypeScript", "Java", "C++", "C#", "C", "PHP", "Ruby", "Go", "Golang", 
    "Rust", "Kotlin", "Swift", "Dart", "R", "Scala", "Shell", "Bash", "PowerShell", "SQL", "NoSQL",
    "HTML", "HTML5", "CSS", "CSS3", "Sass", "SCSS",

    # Frontend Frameworks & Libraries
    "React", "React.js", "React Native", "Next.js", "Vue", "Vue.js", "Nuxt.js", "Angular", "Svelte",
    "Redux", "Zustand", "MobX", "Tailwind CSS", "Bootstrap", "Material UI", "Chakra UI", "Styled Components",
    "jQuery", "Webpack", "Vite", "Babel", "Three.js",

    # Backend Frameworks
    "Django", "Django REST Framework", "DRF", "Flask", "FastAPI", "Node.js", "Express", "Express.js",
    "NestJS", "Spring", "Spring Boot", "ASP.NET", ".NET Core", "Ruby on Rails", "Laravel", "Fastify",

    # Databases & Storage
    "PostgreSQL", "Postgres", "MySQL", "SQLite", "MongoDB", "Redis", "Elasticsearch", "Cassandra",
    "DynamoDB", "Firebase", "Supabase", "Oracle", "MS SQL Server", "CouchDB", "Neo4j",

    # Cloud, DevOps & Infrastructure
    "AWS", "Amazon Web Services", "Azure", "Google Cloud", "GCP", "Docker", "Kubernetes", "K8s",
    "CI/CD", "GitHub Actions", "GitLab CI", "Jenkins", "Terraform", "Ansible", "Nginx", "Apache",
    "Linux", "Ubuntu", "Unix", "Serverless", "Prometheus", "Grafana", "Datadog",

    # AI, Machine Learning & Data Science
    "Machine Learning", "Deep Learning", "Artificial Intelligence", "NLP", "Natural Language Processing",
    "Computer Vision", "LLM", "Generative AI", "PyTorch", "TensorFlow", "Keras", "Scikit-Learn",
    "Pandas", "NumPy", "Matplotlib", "Seaborn", "OpenCV", "Hugging Face", "Transformers",
    "Data Analysis", "Data Science", "Data Engineering", "Big Data", "Spark", "Hadoop", "Airflow",

    # APIs, Architecture & Protocols
    "REST", "REST API", "GraphQL", "gRPC", "WebSocket", "Microservices", "System Design",
    "OAuth", "JWT", "Swagger", "Postman", "SOAP", "Event-Driven Architecture", "Kafka", "RabbitMQ",

    # Methodologies & Tools
    "Git", "GitHub", "GitLab", "Bitbucket", "Agile", "Scrum", "Kanban", "Jira", "Confluence",
    "Unit Testing", "Jest", "Pytest", "TDD", "CI/CD Pipeline", "Selenium", "Cypress", "Playwright",
    
    # Soft & Management Skills
    "Leadership", "Team Leadership", "Project Management", "Problem Solving", "Communication",
    "Critical Thinking", "Mentoring", "Code Review", "Cross-Functional Collaboration", "Time Management"
]

SECTION_PATTERNS = {
    "summary": r"(summary|professional summary|objective|career objective|profile|about me)",
    "experience": r"(experience|work experience|employment history|professional experience|work history)",
    "education": r"(education|academic background|qualifications|academic history)",
    "skills": r"(skills|technical skills|technologies|competencies|core competencies|expertise|tools)",
    "projects": r"(projects|personal projects|academic projects|key projects)",
    "certifications": r"(certifications|certificates|licenses|courses|accreditations)"
}

class ResumeExtractor:
    @classmethod
    def extract_all(cls, text):
        clean_text = cls._clean_text(text)
        email = cls._extract_email(clean_text)
        phone = cls._extract_phone(clean_text)
        name = cls._extract_name(text)
        skills = cls._extract_skills(clean_text)
        education = cls._extract_education(clean_text)
        experience = cls._extract_experience(clean_text)
        detected_sections = cls._detect_sections(clean_text)

        return {
            "name": name,
            "email": email,
            "phone": phone,
            "skills": skills,
            "education": education,
            "experience": experience,
            "detected_sections": detected_sections
        }

    @classmethod
    def _clean_text(cls, text):
        # Normalize whitespace and hyphens
        text = re.sub(r'[\r\t]', ' ', text)
        return text

    @classmethod
    def _extract_email(cls, text):
        pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
        matches = re.findall(pattern, text)
        if matches:
            return matches[0].strip().rstrip('.')
        return None

    @classmethod
    def _extract_phone(cls, text):
        # Match common international or local phone numbers
        pattern = r'(?:(?:\+?\d{1,3}[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}|\+?\d{10,13})'
        matches = re.findall(pattern, text)
        for m in matches:
            clean = re.sub(r'[^\d+]', '', m)
            if len(clean) >= 10:
                return m.strip()
        return None

    @classmethod
    def _extract_name(cls, text):
        lines = [line.strip() for line in text.split('\n') if line.strip()]
        for line in lines[:8]:
            # Skip lines with email, phone, web links, or section headers
            if '@' in line or 'http' in line or 'www.' in line or re.search(r'\d{5,}', line):
                continue
            if re.search(r'(resume|curriculum vitae|cv|page \d|contact)', line, re.I):
                continue
            words = line.split()
            if 2 <= len(words) <= 4 and all(w.isalpha() for w in words):
                return line
        return lines[0][:40] if lines else "Candidate"

    @classmethod
    def _extract_skills(cls, text):
        found_skills = []
        text_lower = f" {text.lower()} "

        for skill in CURATED_SKILLS:
            # Word boundary matching
            skill_lower = skill.lower()
            pattern = r'(?<![a-zA-Z0-9])' + re.escape(skill_lower) + r'(?![a-zA-Z0-9])'
            if re.search(pattern, text_lower):
                found_skills.append(skill)

        # De-duplicate case variants while preserving order
        unique = []
        seen = set()
        for s in found_skills:
            if s.lower() not in seen:
                seen.add(s.lower())
                unique.append(s)
        return unique

    @classmethod
    def _extract_education(cls, text):
        degree_keywords = [
            "Bachelor", "B.S.", "B.Sc", "B.Tech", "B.E.", "BBA", "B.A.",
            "Master", "M.S.", "M.Sc", "M.Tech", "M.E.", "MBA", "M.A.",
            "Ph.D", "Doctorate", "Diploma", "Associate Degree"
        ]
        found_degrees = []
        for line in text.split('\n'):
            for deg in degree_keywords:
                if re.search(r'\b' + re.escape(deg) + r'\b', line, re.IGNORECASE):
                    cleaned = line.strip()[:100]
                    if cleaned and cleaned not in found_degrees:
                        found_degrees.append(cleaned)
                    break
        return found_degrees[:5]

    @classmethod
    def _extract_experience(cls, text):
        role_keywords = [
            "Software Engineer", "Developer", "Full Stack Developer", "Backend Developer", "Frontend Developer",
            "Data Scientist", "Data Analyst", "DevOps Engineer", "Product Manager", "Project Manager",
            "Intern", "Consultant", "Tech Lead", "Architect", "Designer", "Specialist", "Administrator"
        ]
        found_roles = []
        for line in text.split('\n'):
            for role in role_keywords:
                if re.search(r'\b' + re.escape(role) + r'\b', line, re.IGNORECASE):
                    cleaned = line.strip()[:100]
                    if cleaned and cleaned not in found_roles:
                        found_roles.append(cleaned)
                    break
        return found_roles[:5]

    @classmethod
    def _detect_sections(cls, text):
        results = {}
        text_lower = text.lower()
        for sec, pattern in SECTION_PATTERNS.items():
            results[sec] = bool(re.search(r'(?:^|\n)\s*' + pattern + r'\s*(?::|\n|$)', text_lower, re.M))
        return results
