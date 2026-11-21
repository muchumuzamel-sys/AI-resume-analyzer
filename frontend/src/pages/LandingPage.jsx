import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileSearch, 
  Sparkles, 
  CheckCircle2, 
  Target, 
  TrendingUp, 
  ArrowRight,
  ShieldCheck,
  Zap,
  BarChart3,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }}>
      {/* Navigation */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 48px',
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
          }}>
            <FileSearch size={22} />
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1e1b4b' }}>
            AI Resume Analyzer
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', fontWeight: 600, fontSize: '0.95rem' }}>
          <Link to="/" style={{ color: '#4f46e5' }}>Home</Link>
          <Link to="/analyze" style={{ color: '#64748b' }}>Analyze</Link>
          <Link to="/history" style={{ color: '#64748b' }}>History</Link>
          <Link to="/about" style={{ color: '#64748b' }}>About</Link>
        </div>

        <div>
          {user ? (
            <Link
              to="/analyze"
              style={{
                background: '#4f46e5',
                color: 'white',
                padding: '10px 22px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Go to Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <div style={{ display: 'flex', gap: '12px' }}>
              <Link
                to="/login"
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  color: '#4f46e5',
                  border: '1px solid #c7d2fe'
                }}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                Get Started Free
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 24px 60px 24px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ede9fe',
          color: '#5b46e8',
          padding: '8px 18px',
          borderRadius: '9999px',
          fontSize: '0.88rem',
          fontWeight: 700,
          marginBottom: '24px'
        }}>
          <Sparkles size={16} /> Powered by Deep AI & Instant ATS Scoring
        </div>

        <h1 style={{
          fontSize: '3.4rem',
          fontWeight: 800,
          lineHeight: 1.15,
          color: '#0f172a',
          letterSpacing: '-1px',
          marginBottom: '20px'
        }}>
          Land Your Dream Job with an <br />
          <span style={{
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AI-Optimized Resume
          </span>
        </h1>

        <p style={{
          fontSize: '1.2rem',
          color: '#475569',
          maxWidth: '700px',
          margin: '0 auto 36px auto',
          lineHeight: 1.6
        }}>
          Evaluate your resume against real-world Applicant Tracking Systems. Get instant scores, 
          skill gap comparisons, missing keywords, and personalized suggestions in seconds.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button
            onClick={() => navigate('/analyze')}
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #6366f1)',
              color: 'white',
              padding: '16px 36px',
              borderRadius: '12px',
              fontSize: '1.05rem',
              fontWeight: 800,
              boxShadow: '0 10px 25px rgba(79, 70, 229, 0.4)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            Analyze My Resume Free <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 800, marginBottom: '40px' }}>
          Everything You Need to Beat the ATS
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px'
        }}>
          <div style={{ background: 'white', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <Award size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Instant ATS Score</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
              Receive an overall 0–100 score and section-by-section breakdown across ATS readability, skills, and formatting.
            </p>
          </div>

          <div style={{ background: 'white', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <Target size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Job Description Match</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
              Compare your resume directly with target job postings to identify matched keywords and crucial missing terms.
            </p>
          </div>

          <div style={{ background: 'white', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <Zap size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>Actionable AI Feedback</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
              Prioritized recommendations to add quantified metrics, strengthen action verbs, and fix layout flaws.
            </p>
          </div>

          <div style={{ background: 'white', padding: '28px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f3ff', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '18px' }}>
              <BarChart3 size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px' }}>PDF Report & History</h3>
            <p style={{ fontSize: '0.9rem', color: '#64748b', lineHeight: 1.5 }}>
              Download official evaluation reports and track your score improvement trajectory over time.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: '1000px', margin: '70px auto', padding: '0 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '40px' }}>How It Works in 3 Simple Steps</h2>
        <div style={{ display: 'flex', gap: '32px', justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 250px', background: 'white', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4f46e5', marginBottom: '10px' }}>1</div>
            <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Upload Resume</h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Drop your PDF or DOCX file (up to 5MB) into the analyzer.</p>
          </div>
          <div style={{ flex: '1 1 250px', background: 'white', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4f46e5', marginBottom: '10px' }}>2</div>
            <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>AI Parsing & Scoring</h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Our algorithms inspect ATS compatibility, keywords, and achievements.</p>
          </div>
          <div style={{ flex: '1 1 250px', background: 'white', padding: '24px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#4f46e5', marginBottom: '10px' }}>3</div>
            <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>Improve & Apply</h4>
            <p style={{ fontSize: '0.88rem', color: '#64748b' }}>Apply tailored recommendations and download your executive PDF report.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        marginTop: '80px',
        padding: '36px 48px',
        background: '#0f172a',
        color: '#94a3b8',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'white', fontWeight: 700 }}>
          <FileSearch size={20} color="#818cf8" /> AI Resume Analyzer
        </div>
        <div style={{ fontSize: '0.85rem' }}>
          Built with ReactJS & Django REST Framework • WCAG 2.1 Compliant
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
