import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { resumeService } from '../services/resumeService';
import { authService } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { 
  Eye, 
  Download, 
  Trash2, 
  TrendingUp, 
  User, 
  Lock, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Calendar,
  FileText
} from 'lucide-react';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileTab, setProfileTab] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);
  
  // Profile fields
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const navigate = useNavigate();

  const fetchHistory = () => {
    setLoading(true);
    resumeService.getHistory()
      .then((data) => setHistory(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete analysis for "${name}"?`)) return;
    try {
      await resumeService.deleteAnalysis(id);
      setHistory(history.filter(item => item.id !== id));
    } catch (e) {
      alert('Failed to delete analysis.');
    }
  };

  const handleDownload = async (id, name) => {
    try {
      await resumeService.downloadReport(id, `Report_${name.replace(/\.[^/.]+$/, "")}.pdf`);
    } catch (e) {
      alert('Failed to download report.');
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg(null);

    const payload = { name };
    if (newPassword) {
      payload.current_password = currentPassword;
      payload.new_password = newPassword;
    }

    try {
      const res = await authService.updateProfile(payload);
      setUser(res.user);
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      const errData = err.response?.data;
      const text = errData ? (errData.current_password?.[0] || errData.new_password?.[0] || errData.detail || 'Update failed.') : 'Failed to update profile.';
      setProfileMsg({ type: 'error', text });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-viewport">
        <Header />

        {/* View Toggle */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827' }}>
              {profileTab ? 'Account & Profile Settings' : 'Analysis History & Score Trends'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
              {profileTab ? 'Manage your credentials and preferences' : 'Track your resume score progression over time'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px', background: '#e2e8f0', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => setProfileTab(false)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: !profileTab ? 'white' : 'transparent',
                color: !profileTab ? '#4f46e5' : '#64748b',
                boxShadow: !profileTab ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Analyses & Trends
            </button>
            <button
              onClick={() => setProfileTab(true)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 700,
                background: profileTab ? 'white' : 'transparent',
                color: profileTab ? '#4f46e5' : '#64748b',
                boxShadow: profileTab ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Profile Settings
            </button>
          </div>
        </div>

        {!profileTab ? (
          <>
            {/* Score Trend Chart Card (FR-25) */}
            {history.length > 0 && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={20} color="#4f46e5" />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                      Resume Score Improvement Trend
                    </h3>
                  </div>
                  <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {history.length} {history.length === 1 ? 'analysis' : 'analyses'} recorded
                  </span>
                </div>

                {/* SVG Visual Trend Chart */}
                <div style={{ height: '140px', width: '100%', position: 'relative' }}>
                  <svg width="100%" height="100%" viewBox="0 0 600 130" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeDasharray="4" />
                    <line x1="0" y1="70" x2="600" y2="70" stroke="#f1f5f9" strokeDasharray="4" />
                    <line x1="0" y1="110" x2="600" y2="110" stroke="#f1f5f9" strokeDasharray="4" />

                    {/* Compute points */}
                    {(() => {
                      const reversed = [...history].reverse();
                      const count = reversed.length;
                      if (count === 1) {
                        const y = 120 - (reversed[0].overall_score / 100) * 100;
                        return (
                          <circle cx="300" cy={y} r="6" fill="#4f46e5" />
                        );
                      }
                      const step = 560 / (count - 1);
                      const points = reversed.map((item, i) => {
                        const x = 20 + i * step;
                        const y = 120 - (item.overall_score / 100) * 100;
                        return `${x},${y}`;
                      }).join(' ');

                      const firstX = 20;
                      const lastX = 20 + (count - 1) * step;
                      const areaPoints = `${firstX},125 ${points} ${lastX},125`;

                      return (
                        <>
                          <polygon points={areaPoints} fill="url(#trendGrad)" />
                          <polyline points={points} fill="none" stroke="#4f46e5" strokeWidth="3" strokeLinecap="round" />
                          {reversed.map((item, i) => {
                            const x = 20 + i * step;
                            const y = 120 - (item.overall_score / 100) * 100;
                            return (
                              <g key={i}>
                                <circle cx={x} cy={y} r="5" fill="#ffffff" stroke="#4f46e5" strokeWidth="2.5" />
                                <text x={x} y={y - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">
                                  {item.overall_score}%
                                </text>
                              </g>
                            );
                          })}
                        </>
                      );
                    })()}
                  </svg>
                </div>
              </div>
            )}

            {/* History Table Card */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: '16px' }}>
                All Saved Resume Analyses
              </h3>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#6366f1' }}>
                  <Loader2 size={32} className="spin" style={{ margin: '0 auto 8px auto' }} />
                  <p>Loading history records...</p>
                </div>
              ) : history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 20px', color: '#64748b' }}>
                  <FileText size={40} color="#cbd5e1" style={{ margin: '0 auto 12px auto' }} />
                  <p style={{ fontWeight: 600 }}>No resume analyses yet.</p>
                  <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                    Upload your first resume on the analyze page to generate scores and feedback.
                  </p>
                  <button
                    onClick={() => navigate('/analyze')}
                    style={{
                      marginTop: '16px',
                      background: '#4f46e5',
                      color: 'white',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.85rem'
                    }}
                  >
                    Analyze Now
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b' }}>
                        <th style={{ padding: '12px 14px' }}>File Name</th>
                        <th style={{ padding: '12px 14px' }}>Target Role</th>
                        <th style={{ padding: '12px 14px' }}>Overall Score</th>
                        <th style={{ padding: '12px 14px' }}>Rating</th>
                        <th style={{ padding: '12px 14px' }}>Date</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((item) => (
                        <tr
                          key={item.id}
                          style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = '#fbfbfe'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                          <td style={{ padding: '14px', fontWeight: 700, color: '#1e293b' }}>
                            {item.original_name}
                          </td>
                          <td style={{ padding: '14px', color: '#475569' }}>
                            {item.job_title || 'General'}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span style={{
                              fontWeight: 800,
                              color: item.overall_score >= 80 ? '#10b981' : (item.overall_score >= 60 ? '#f59e0b' : '#ef4444')
                            }}>
                              {item.overall_score}%
                            </span>
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span style={{
                              background: item.overall_score >= 80 ? '#ecfdf5' : '#eff6ff',
                              color: item.overall_score >= 80 ? '#059669' : '#3b82f6',
                              padding: '4px 8px',
                              borderRadius: '6px',
                              fontSize: '0.78rem',
                              fontWeight: 700
                            }}>
                              {item.rating_label}
                            </span>
                          </td>
                          <td style={{ padding: '14px', color: '#64748b', fontSize: '0.82rem' }}>
                            {new Date(item.created_at).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '14px', textAlign: 'right' }}>
                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                              <button
                                onClick={() => navigate(`/results/${item.id}`)}
                                title="View Result Details"
                                style={{
                                  background: '#f1f5f9',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  color: '#475569'
                                }}
                              >
                                <Eye size={16} />
                              </button>
                              <button
                                onClick={() => handleDownload(item.id, item.original_name)}
                                title="Download PDF Report"
                                style={{
                                  background: '#ede9fe',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  color: '#6366f1'
                                }}
                              >
                                <Download size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(item.id, item.original_name)}
                                title="Delete Analysis"
                                style={{
                                  background: '#fee2e2',
                                  padding: '6px',
                                  borderRadius: '6px',
                                  color: '#dc2626'
                                }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Profile & Password Update Tab (FR-5) */
          <div style={{
            maxWidth: '560px',
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '20px', color: '#1e293b' }}>
              Edit Profile & Credentials
            </h3>

            {profileMsg && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                background: profileMsg.type === 'success' ? '#ecfdf5' : '#fef2f2',
                color: profileMsg.type === 'success' ? '#059669' : '#dc2626',
                border: `1px solid ${profileMsg.type === 'success' ? '#a7f3d0' : '#fecaca'}`
              }}>
                {profileMsg.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Email Address
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.email || ''}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    color: '#64748b',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ borderTop: '1px dashed #e2e8f0', paddingTop: '16px', marginTop: '6px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#334155', marginBottom: '10px' }}>
                  Change Password (Optional)
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>
                      New Password (Min 8 chars, mixed case, digit)
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.88rem',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                style={{
                  background: '#4f46e5',
                  color: 'white',
                  padding: '12px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '10px'
                }}
              >
                {savingProfile ? <Loader2 size={16} className="spin" /> : null}
                Save Profile Changes
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default HistoryPage;
