// components/industry/EducationRecommendations.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function EducationRecommendations() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sector, setSector] = useState('Technology');

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/industry/education', {
        params: { sector }
      });
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      if (error.response?.status === 404) {
        alert('Please run skill gap analysis first for this sector');
      } else {
        alert('Failed to fetch recommendations: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sector) {
      fetchRecommendations();
    }
  }, [sector]);

  const getTypeIcon = (type) => {
    const icons = {
      'course': '📚',
      'certification': '🎓',
      'degree': '🎓',
      'bootcamp': '💻',
      'workshop': '🔧'
    };
    return icons[type] || '📖';
  };

  const getRelevanceColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Education & Course Recommendations</h2>
        <p className="text-gray-600 mb-6">
          Personalized course and program recommendations based on your skill gaps.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Sector</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
        </div>
      ) : recommendations.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No recommendations available. Please run skill gap analysis first.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{getTypeIcon(rec.type)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{rec.title}</h3>
                    <p className="text-sm text-gray-600">{rec.provider}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRelevanceColor(rec.relevanceScore)}`}>
                  {rec.relevanceScore}% match
                </span>
              </div>

              <div className="mb-4">
                <p className="text-gray-700 mb-2">{rec.reason}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>⏱ {rec.duration}</span>
                  <span>💰 {rec.cost.amount === 0 ? 'Free' : `$${rec.cost.amount} ${rec.cost.currency}`}</span>
                  <span>📱 {rec.format}</span>
                </div>
              </div>

              {rec.skillsCovered && rec.skillsCovered.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Skills Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {rec.skillsCovered.map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  {rec.rating && (
                    <span>⭐ {rec.rating}/5</span>
                  )}
                  {rec.completionRate && (
                    <span className="ml-3">✓ {rec.completionRate}% completion</span>
                  )}
                </div>
                {rec.url && (
                  <a
                    href={rec.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    View Course
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EducationRecommendations;
