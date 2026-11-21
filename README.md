# AI Resume Analyzer

An intelligent, full-stack web application designed to evaluate resumes using Artificial Intelligence, Natural Language Processing, and automated ATS (Applicant Tracking System) scoring.

Built in strict compliance with the **Software Requirements Specification (SRS v1.0)** and replicating the reference UI design.

---

## 🎨 UI Replication Highlights

The user interface matches the reference dashboard design:
- **Left Dark Sidebar**:
  - Logo with document search icon & title **"AI Resume Analyzer"**
  - Navigation links: **Home**, **History**, **About**, **Settings** (with active pill styling)
  - Bottom graphic card: 3D resume document with glowing purple **"AI"** microchip badge & **"Build a Better Resume with AI ✨"** callout.
- **Top Header Bar**:
  - Greeting: **"Welcome Back! 👋"** and **"Analyze your resume and get instant feedback"**
  - User profile avatar dropdown with account management and logout options.
- **Hero Title Banner**:
  - Gradient title: **"AI Resume Analyzer"**
  - Subtitle: *"Upload your resume and let AI analyze it for you. Get a detailed score, personalized feedback, and improvement tips."*
  - Top-right floating graphic: 3D paper illustration with avatar, lines, and an AI chip badge.
- **Top 2-Column Grid**:
  - **Left Card ("Upload Your Resume")**: Dashed border container, cloud upload icon with upward purple arrow, drag & drop support, **[Choose File]** button, file size validation (< 5MB), and optional Job Description toggle.
  - **Right Card ("Score Card")**: Circular SVG gauge with animated green arc (**92% Overall Score**), **"Excellent Resume!"** badge, **[Download Report]** button, and 4 metric stat boxes:
    1. **ATS Friendly**: `Yes`
    2. **Readability**: `Excellent`
    3. **Skills Match**: `92%`
    4. **Estimated Match**: `95%`
- **Middle 2-Column Row**:
  - **Strengths (Green Badge)**: *Strong skills section*, *Good work experience*, *Clear and professional format*.
  - **Areas for Improvement (Red Badge)**: *Add more quantified achievements*, *Include a summary statement*, *Improve keyword usage for ATS*.
- **Bottom Banner ("Pro Tips")**:
  - Lightbulb icon, actionable tip text (*"Tailor your resume with relevant keywords from the job description to increase your chances of getting hired."*), and stylized purple upward trending bar chart.

---

## 🚀 Key Features & SRS Compliance

| Requirement ID | Description | Status | Implementation Details |
|---|---|---|---|
| **FR-1 to FR-4** | User Auth & JWT | ✅ Complete | Django SimpleJWT (`/api/v1/auth/login/`, `register/`, `refresh/`), password strength validator (min 8 chars, mixed case, digit). |
| **FR-5 & FR-6** | Profile & Access Control | ✅ Complete | Protected React routes, profile editing, password update at `/settings`. |
| **FR-7 to FR-10** | Resume Upload & Validation | ✅ Complete | PDF & DOCX MIME/header inspection, 5MB file size limit, secure storage outside web root. |
| **FR-11 to FR-13** | Resume Text & Section Parsing | ✅ Complete | Text extraction via `pypdf` and `python-docx`, detection of Summary, Experience, Education, Skills, Projects, Certs. |
| **FR-14 to FR-18** | AI Scoring & Suggestions | ✅ Complete | Weighted composite scoring (0–100), ATS metrics, action verb analysis, quantified achievement counters, prioritized suggestions. |
| **FR-19 to FR-21** | Job Description Matching | ✅ Complete | TF-IDF Cosine Similarity vectorizer, matched & missing keyword tags. |
| **FR-22 to FR-25** | Results, History & PDF Report | ✅ Complete | Interactive Results Dashboard (`/results/:id`), Score trend chart on `/history`, branded executive PDF generation via ReportLab. |
| **FR-26 & FR-27** | Admin Management | ✅ Complete | Django Admin (`/admin/`) with registered User, Resume, and Analysis models. |

---

## 🛠️ Technology Stack

- **Frontend**:
  - ReactJS 18+ (SPA with semantic HTML5 & responsive CSS3 Flexbox/Grid)
  - Vite build tool
  - Lucide React icons
  - React Router DOM v6
  - Axios with JWT interceptors
- **Backend**:
  - Python 3.10+ / Django 4.2+ & Django REST Framework
  - SimpleJWT for stateless token authentication
  - PyPDF & python-docx for resume document extraction
  - ReportLab for PDF report generation
  - NumPy for TF-IDF Cosine Similarity vector matching
  - SQLite (development) / PostgreSQL (production ready)

---

## 💻 Quick Start & Running the Application

### 1. Backend Setup (Django)

In a terminal, navigate to the `backend` folder:
```bash
cd backend
python manage.py migrate
python populate_demo.py
python manage.py runserver 8000
```
Backend runs at `http://localhost:8000/`.

### 2. Frontend Setup (React + Vite)

In a second terminal, navigate to the `frontend` folder:
```bash
cd frontend
npm run dev
```
Frontend runs at `http://localhost:5173/` (and connects automatically to `http://localhost:8000/api/v1/`).

*Alternatively, the backend is also configured to serve the production build of the frontend directly at `http://localhost:8000/`.*

---

## 🔑 Default Demo Accounts

- **Job Seeker Demo Account**:
  - **Email**: `demo@example.com`
  - **Password**: `Password123`
  - *(Pre-seeded with a sample 92% resume analysis matching the reference UI screenshot!)*
- **Administrator Account**:
  - **Email**: `admin@example.com`
  - **Password**: `AdminPassword123`
  - Access Django Admin at `http://localhost:8000/admin/`.

---

## 🧪 Running Automated Tests

Run backend unit and integration tests:
```bash
cd backend
python manage.py test
```
All tests verify authentication, file upload, text extraction, scoring engine, and PDF report generation.
