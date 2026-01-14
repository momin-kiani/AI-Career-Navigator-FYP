// components/profile/ProfileCompleteness.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function ProfileCompleteness() {
  const [completeness, setCompleteness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompleteness();
  }, []);

  const fetchCompleteness = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/profile/score');
      setCompleteness(response.data);
    } catch (error) {
      console.error('Error fetching completeness:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'from-green-500 to-green-600';
    if (score >= 75) return 'from-blue-500 to-blue-600';
    if (score >= 60) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Calculating profile completeness...</p>
      </div>
    );
  }

  if (!completeness) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-600">Unable to load profile completeness</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Score */}
      <div className={`bg-gradient-to-br ${getScoreColor(completeness.score)} rounded-xl shadow-md p-8 text-white`}>
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">{completeness.score}%</div>
          <div className="text-2xl mb-2">{completeness.grade}</div>
          <p className="text-lg opacity-90">Profile Completeness Score</p>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Score Breakdown</h2>
        <div className="space-y-4">
          {Object.entries(completeness.breakdown).map(([key, section]) => (
            <div key={key}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="text-gray-600 font-medium">
                  {section.score} / {section.max}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${(section.score / section.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      {completeness.suggestions && completeness.suggestions.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Improvement Suggestions</h2>
          <div className="space-y-3">
            {completeness.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-yellow-600 mr-3 text-xl">⚠️</span>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-gray-800">{suggestion.suggestion}</span>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                      suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {suggestion.priority} priority
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">Category: {suggestion.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Explanation */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">How Completeness is Calculated</h3>
        <p className="text-sm text-blue-700 mb-3">
          Profile completeness is calculated across 5 key dimensions:
        </p>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li><strong>Basic Info (25 points):</strong> Name, email, location</li>
          <li><strong>Contact Info (15 points):</strong> Phone number, profile image</li>
          <li><strong>Professional Links (20 points):</strong> LinkedIn, GitHub, portfolio URLs</li>
          <li><strong>Profile Content (25 points):</strong> Headline, summary, resume</li>
          <li><strong>Additional Info (15 points):</strong> Email verification, optimized resume/LinkedIn</li>
        </ul>
      </div>
    </div>
  );
}

export default ProfileCompleteness;
