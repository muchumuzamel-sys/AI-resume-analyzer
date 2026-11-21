import React from 'react';
import { TrendingUp, BarChart2 } from 'lucide-react';

const ProTipBanner = ({ text }) => {
  const displayText = text || 'Tailor your resume with relevant keywords from the job description to increase your chances of getting hired.';

  return (
    <div className="protips-banner">
      <div className="protips-content">
        <div className="protips-bulb">
          💡
        </div>
        <div className="protips-text-box">
          <h4>Pro Tips</h4>
          <p>{displayText}</p>
        </div>
      </div>

      <div className="protips-trend-icon">
        {/* Stylized Bar Chart with Upward Trend Arrow matching UI */}
        <svg width="42" height="38" viewBox="0 0 42 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="24" width="7" height="12" rx="2" fill="#818cf8" />
          <rect x="13" y="16" width="7" height="20" rx="2" fill="#6366f1" />
          <rect x="24" y="8" width="7" height="28" rx="2" fill="#4f46e5" />
          <path d="M2 16L15 6L24 11L38 2" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M31 2H38V9" stroke="#4338ca" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default ProTipBanner;
