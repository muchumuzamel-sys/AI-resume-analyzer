import React from 'react';

const ScoreGauge = ({ score = 92, strokeWidth = 8, size = 100 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const normalizedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  // Color determination based on score
  let ringColor = '#10b981'; // Green
  if (normalizedScore < 50) {
    ringColor = '#ef4444'; // Red
  } else if (normalizedScore < 75) {
    ringColor = '#f59e0b'; // Amber
  }

  return (
    <div className="circular-gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle
          className="gauge-circle-bg"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className="gauge-circle-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          stroke={ringColor}
        />
      </svg>
      <div className="gauge-text-inner">
        <span className="gauge-score-value">{normalizedScore}%</span>
        <span className="gauge-score-label">Overall Score</span>
      </div>
    </div>
  );
};

export default ScoreGauge;
