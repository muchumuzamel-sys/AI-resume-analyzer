import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Shield, Sparkles, Code, Cpu, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-viewport">
        <Header />

        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '36px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: '#ede9fe',
              color: '#5b46e8',
              padding: '6px 12px',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '16px'
            }}>
              <Sparkles size={14} /> System Information
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              About AI Resume Analyzer
            </h2>
            <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem', marginBottom: '24px' }}>
              The <b>AI Resume Analyzer</b> is an intelligent evaluation engine built using modern web standards 
              (ReactJS + CSS3 on the client, and Django REST Framework on the backend). It is designed to bridge the gap 
              between job candidates and enterprise Applicant Tracking Systems (ATS).
            </p>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
              How the Scoring Works
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 800, color: '#4f46e5', marginBottom: '4px' }}>ATS Compatibility (25%)</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Detection of standard sections, parseable text, length constraints, and contact info completeness.</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 800, color: '#4f46e5', marginBottom: '4px' }}>Skills Match (25%)</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Evaluation of 500+ modern technical and management competencies against industry benchmarks.</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 800, color: '#4f46e5', marginBottom: '4px' }}>Experience & Impact (20%)</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Analysis of decisive action verbs, quantified results (%, $, metrics), and structured progression.</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontWeight: 800, color: '#4f46e5', marginBottom: '4px' }}>JD Keyword Alignment (20%)</div>
                <div style={{ fontSize: '0.82rem', color: '#64748b' }}>TF-IDF vector cosine similarity identifying matched and missing keywords against target job descriptions.</div>
              </div>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1e293b', marginBottom: '12px' }}>
              Privacy & Data Protection (NFR-9, NFR-10)
            </h3>
            <p style={{ color: '#4b5563', lineHeight: 1.6, fontSize: '0.9rem' }}>
              Your resume data is strictly personal. We do not sell or share uploaded documents with third parties. 
              Users have the right to permanently delete their resume files and analysis records at any time from the History page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
