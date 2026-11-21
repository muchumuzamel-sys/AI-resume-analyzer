import React from 'react';
import { Check, AlertCircle } from 'lucide-react';

const HighlightsCard = ({ strengths = [], areasForImprovement = [] }) => {
  // Default values matching UI image if not populated
  const displayStrengths = strengths.length > 0 ? strengths : [
    'Strong skills section',
    'Good work experience',
    'Clear and professional format'
  ];

  const displayImprovements = areasForImprovement.length > 0 ? areasForImprovement : [
    'Add more quantified achievements',
    'Include a summary statement',
    'Improve keyword usage for ATS'
  ];

  return (
    <div className="highlights-grid">
      {/* Strengths Card */}
      <div className="highlight-card">
        <div className="highlight-badge badge-strengths">
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: 'white',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Check size={13} strokeWidth={3} />
          </div>
          <span>Strengths</span>
        </div>

        <ul className="highlight-list">
          {displayStrengths.map((item, index) => (
            <li key={index} className="highlight-item">
              <span className="item-icon-green">
                <Check size={12} strokeWidth={3} />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Areas for Improvement Card */}
      <div className="highlight-card">
        <div className="highlight-badge badge-improvements">
          <div style={{
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            background: '#ef4444',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 900 }}>!</span>
          </div>
          <span>Areas for Improvement</span>
        </div>

        <ul className="highlight-list">
          {displayImprovements.map((item, index) => (
            <li key={index} className="highlight-item">
              <span className="item-icon-red">
                <span style={{ fontSize: '11px', fontWeight: 900 }}>!</span>
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HighlightsCard;
