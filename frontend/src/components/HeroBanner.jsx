import React from 'react';
import { Sparkles, Cpu } from 'lucide-react';

const HeroBanner = () => {
  return (
    <div className="dashboard-hero">
      <h1 className="dashboard-hero-title">AI Resume Analyzer</h1>
      <p className="dashboard-hero-sub">Upload your resume and let AI analyze it for you.</p>
      <p className="dashboard-hero-sub">Get a detailed score, personalized feedback, and improvement tips.</p>

      {/* Decorative Resume + AI Chip Illustration matching image */}
      <div className="hero-illustration">
        <div className="hero-ill-card">
          <div className="hero-ill-avatar"></div>
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', width: '90%', marginBottom: '6px' }}></div>
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', width: '70%', marginBottom: '6px' }}></div>
          <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '2px', width: '80%', marginBottom: '6px' }}></div>
          <div style={{ height: '4px', background: '#cbd5e1', borderRadius: '2px', width: '50%', marginBottom: '6px' }}></div>
        </div>

        <div className="hero-ill-chip">
          <Cpu size={16} />
          <span>AI</span>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
