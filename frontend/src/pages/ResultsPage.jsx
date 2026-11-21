import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ScoreGauge from '../components/ScoreGauge';
import { resumeService } from '../services/resumeService';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Tag, 
  Target, 
  Loader2,
  RefreshCw
} from 'lucide-react';

const ResultsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    resumeService.getAnalysis(id)
      .then((data) => {
        setAnalysis(data);
        setError('');
      })
      .catch((err) => {
        setError('Failed to load analysis details. The analysis may not exist or has been deleted.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleDownload = async () => {
    if (!analysis) return;
    setDownloading(true);
    try {
      await resumeService.downloadReport(analysis.id, `Resume_Analysis_Report_${analysis.id}.pdf`);
    } catch (e) {
      alert('Error downloading report.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-viewport" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: '#6366f1' }}>
            <Loader2 size={40} className="spin" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ fontWeight: 600 }}>Loading Comprehensive Analysis...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="app-layout">
        <Sidebar />
        <main className="main-viewport">
          <Header />
          <div style={{
            background: 'white',
            padding: '40px',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '600px',
            margin: '40px auto',
            border: '1px solid #fee2e2'
          }}>
            <AlertCircle size={44} color="#ef4444" style={{ margin: '0 auto 12px auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#111827' }}>Analysis Not Found</h3>
            <p style={{ color: '#64748b', margin: '8px 0 20px 0' }}>{error}</p>
            <button
              onClick={() => navigate('/analyze')}
              style={{
                background: '#4f46e5',
                color: 'white',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700
              }}
            >
              Analyze a Resume
            </button>
          </div>
        </main>
      </div>
    );
  }

  const sec = analysis.section_scores || {};
  const extracted = analysis.extracted_data || {};
  const qm = analysis.quick_metrics || {};

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-viewport">
        <Header />

        {/* Top Action Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <button
            onClick={() => navigate('/analyze')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'white',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              color: '#4f46e5',
              border: '1px solid #e0e7ff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.03)'
            }}
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => navigate('/analyze')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'white',
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: '#334155',
                border: '1px solid #cbd5e1'
              }}
            >
              <RefreshCw size={15} /> Analyze Another
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#4f46e5',
                padding: '8px 18px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'white',
                boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
              }}
            >
              {downloading ? <Loader2 size={16} className="spin" /> : <Download size={16} />}
              Download Report (PDF)
            </button>
          </div>
        </div>

        {/* Overall Score Summary Header Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '28px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          marginBottom: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <ScoreGauge score={analysis.overall_score} size={110} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827' }}>
                  {analysis.rating_label}
                </h2>
                <span style={{
                  background: analysis.overall_score >= 80 ? '#ecfdf5' : '#fef3c7',
                  color: analysis.overall_score >= 80 ? '#059669' : '#d97706',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  Score {analysis.overall_score}/100
                </span>
              </div>
              <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px', maxWidth: '500px' }}>
                {analysis.rating_desc}
              </p>
              <div style={{ display: 'flex', gap: '16px', marginTop: '10px', fontSize: '0.8rem', color: '#6b7280' }}>
                <span><b>File:</b> {analysis.original_name}</span>
                {analysis.job_title && <span><b>Target:</b> {analysis.job_title}</span>}
              </div>
            </div>
          </div>

          {/* Quick Stat Tags */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ATS Friendly</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>{qm.ats_friendly || 'Yes'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Readability</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>{qm.readability || 'Excellent'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Skills Match</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>{qm.skills_match || '92%'}</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '10px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>JD Match</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: '#059669' }}>
                {analysis.match_percentage > 0 ? `${analysis.match_percentage}%` : 'N/A'}
              </div>
            </div>
          </div>
        </div>

        {/* Section Scores Breakdown (Progress Bars) */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          marginBottom: '22px'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: '18px' }}>
            Section-Wise Performance Scores
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { label: 'ATS Compatibility', val: sec.ats || 85, weight: '25%' },
              { label: 'Skills Relevance', val: sec.skills || 90, weight: '25%' },
              { label: 'Experience Quality', val: sec.experience || 75, weight: '20%' },
              { label: 'Formatting & Layout', val: sec.formatting || 80, weight: '20%' },
              { label: 'Education & Certs', val: sec.education || 85, weight: '10%' },
            ].map((item, idx) => (
              <div key={idx} style={{ background: '#fbfbfe', padding: '14px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#334155' }}>{item.label}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4f46e5' }}>{item.val}%</span>
                </div>
                <div style={{ height: '7px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${item.val}%`,
                    background: item.val >= 80 ? '#10b981' : (item.val >= 60 ? '#f59e0b' : '#ef4444'),
                    borderRadius: '4px'
                  }}></div>
                </div>
                <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '4px', textAlign: 'right' }}>
                  Weight: {item.weight}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2-Column: Extracted Profile & Job Match Keywords */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '22px',
          marginBottom: '22px'
        }}>
          {/* Extracted Details */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#4f46e5" /> Extracted Candidate Profile
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.88rem' }}>
              <div><b>Name:</b> {extracted.name || 'Not detected'}</div>
              <div><b>Email:</b> {extracted.email || 'Not detected'}</div>
              <div><b>Phone:</b> {extracted.phone || 'Not detected'}</div>

              {extracted.education && extracted.education.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <b>Education:</b>
                  <ul style={{ paddingLeft: '18px', color: '#4b5563', marginTop: '4px' }}>
                    {extracted.education.map((edu, i) => (
                      <li key={i}>{edu}</li>
                    ))}
                  </ul>
                </div>
              )}

              {extracted.experience && extracted.experience.length > 0 && (
                <div style={{ marginTop: '8px' }}>
                  <b>Experience Positions:</b>
                  <ul style={{ paddingLeft: '18px', color: '#4b5563', marginTop: '4px' }}>
                    {extracted.experience.map((exp, i) => (
                      <li key={i}>{exp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Extracted Skills & Job Match */}
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Tag size={18} color="#4f46e5" /> Detected Skills ({extracted.skills?.length || 0})
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '18px' }}>
              {extracted.skills && extracted.skills.length > 0 ? (
                extracted.skills.map((skill, i) => (
                  <span
                    key={i}
                    style={{
                      background: '#ede9fe',
                      color: '#5b46e8',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: 700
                    }}
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>No skills detected.</span>
              )}
            </div>

            {/* Keyword Match Panel if JD supplied */}
            {analysis.job_description && (
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Target size={16} color="#059669" /> JD Keyword Match ({analysis.match_percentage}%)
                </h4>

                <div style={{ marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#059669', marginBottom: '4px' }}>
                    Matched Keywords ({analysis.matched_keywords?.length || 0}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {analysis.matched_keywords?.map((kw, i) => (
                      <span key={i} style={{ background: '#ecfdf5', color: '#059669', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 700 }}>
                        ✓ {kw}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#dc2626', marginBottom: '4px' }}>
                    Missing Keywords ({analysis.missing_keywords?.length || 0}):
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                    {analysis.missing_keywords?.map((kw, i) => (
                      <span key={i} style={{ background: '#fef2f2', color: '#dc2626', padding: '3px 8px', borderRadius: '5px', fontSize: '0.75rem', fontWeight: 700 }}>
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actionable Suggestions Grouped by Priority */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>
            Actionable AI Recommendations
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analysis.suggestions && analysis.suggestions.length > 0 ? (
              analysis.suggestions.map((item, idx) => {
                const prio = (item.priority || 'medium').toLowerCase();
                const badgeBg = prio === 'high' ? '#fee2e2' : (prio === 'medium' ? '#fef3c7' : '#eff6ff');
                const badgeColor = prio === 'high' ? '#b91c1c' : (prio === 'medium' ? '#b45309' : '#1d4ed8');

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '14px 16px',
                      borderRadius: '10px',
                      background: '#fbfbfe',
                      border: '1px solid #f1f5f9'
                    }}
                  >
                    <span style={{
                      background: badgeBg,
                      color: badgeColor,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      textTransform: 'uppercase'
                    }}>
                      {item.priority}
                    </span>
                    <div style={{ flex: 1 }}>
                      {item.category && (
                        <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: '2px' }}>
                          {item.category}
                        </div>
                      )}
                      <div style={{ fontSize: '0.88rem', color: '#334155', fontWeight: 500, lineHeight: 1.45 }}>
                        {item.text}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                No critical issues found! Your resume format satisfies standard guidelines.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsPage;
