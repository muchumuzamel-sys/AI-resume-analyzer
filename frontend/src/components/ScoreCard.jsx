import React from 'react';
import ScoreGauge from './ScoreGauge';
import { Download, Briefcase, FileText, Star, Clock } from 'lucide-react';

const MetricBox = ({ icon: Icon, label, value }) => {
  return (
    <div className="metric-box">
      <div className="metric-box-icon">
        <Icon size={20} strokeWidth={2.2} />
      </div>
      <div>
        <div className="metric-box-label">{label}</div>
        <div className="metric-box-value">{value}</div>
      </div>
    </div>
  );
};

const ScoreCard = ({ analysis, onDownloadReport }) => {
  // Default values matching the provided reference UI when empty/fresh
  const score = analysis?.overall_score ?? 92;
  const ratingLabel = analysis?.rating_label || 'Excellent Resume!';
  const ratingDesc = analysis?.rating_desc || 
    'Your resume is well-optimized. Just a few improvements can make it even better.';

  const qm = analysis?.quick_metrics || {};
  const atsFriendly = qm.ats_friendly || 'Yes';
  const readability = qm.readability || 'Excellent';
  const skillsMatch = qm.skills_match || '92%';
  const estimatedMatch = qm.estimated_match || '95%';

  return (
    <div className="score-card-container">
      <div className="score-card-top">
        <div className="score-gauge-wrap">
          <ScoreGauge score={score} size={105} />
          <div className="score-header-info">
            <h3 className="score-status-title">{ratingLabel}</h3>
            <p className="score-status-desc">{ratingDesc}</p>
          </div>
        </div>

        <button 
          className="btn-download-report"
          onClick={onDownloadReport}
        >
          <Download size={16} strokeWidth={2.2} />
          <span>Download Report</span>
        </button>
      </div>

      <div className="metrics-row-grid">
        <MetricBox
          icon={Briefcase}
          label="ATS Friendly"
          value={atsFriendly}
        />
        <MetricBox
          icon={FileText}
          label="Readability"
          value={readability}
        />
        <MetricBox
          icon={Star}
          label="Skills Match"
          value={skillsMatch}
        />
        <MetricBox
          icon={Clock}
          label="Estimated Match"
          value={estimatedMatch}
        />
      </div>
    </div>
  );
};

export default ScoreCard;
