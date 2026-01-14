// components/resume/ATSScoreCard.jsx
import React from 'react';

function ATSScoreCard({ score, breakdown }) {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-blue-100';
    if (score >= 40) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  return (
    <div className="text-center">
      <div className={`inline-block px-4 py-2 rounded-lg ${getScoreBg(score)}`}>
        <div className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}%</div>
        <div className="text-xs text-gray-600">ATS Score</div>
      </div>
    </div>
  );
}

export default ATSScoreCard;
