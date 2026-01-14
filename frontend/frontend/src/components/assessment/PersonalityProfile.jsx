// components/assessment/PersonalityProfile.jsx
import React from 'react';

function PersonalityProfile({ traits }) {
  const getTraitColor = (score) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 45) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const getTraitLabel = (trait) => {
    const labels = {
      'analytical': 'Analytical',
      'creative': 'Creative',
      'leadership': 'Leadership',
      'detail-oriented': 'Detail-Oriented',
      'communicative': 'Communicative',
      'collaborative': 'Collaborative',
      'independent': 'Independent',
      'structured': 'Structured'
    };
    return labels[trait] || trait;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Personality Profile</h2>
      <p className="text-gray-600 mb-6">
        Your personality traits based on assessment responses. Scores range from 0-100.
      </p>
      
      <div className="space-y-4">
        {traits.map((trait, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">{getTraitLabel(trait.name)}</span>
              <span className="text-gray-600 font-medium">{trait.score}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className={`${getTraitColor(trait.score)} h-4 rounded-full transition-all`}
                style={{ width: `${trait.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>How it works:</strong> Each trait score is calculated from your responses to relevant questions. 
          Higher scores indicate stronger alignment with that trait. The algorithm uses weighted averages to ensure 
          accurate representation of your personality profile.
        </p>
      </div>
    </div>
  );
}

export default PersonalityProfile;
