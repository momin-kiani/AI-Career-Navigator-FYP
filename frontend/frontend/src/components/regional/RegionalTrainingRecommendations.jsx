// components/regional/RegionalTrainingRecommendations.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function RegionalTrainingRecommendations() {
  const [trainingData, setTrainingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: 'San Francisco',
    industry: ''
  });

  const fetchTrainingData = async () => {
    setLoading(true);
    try {
      const params = { city: filters.city };
      if (filters.industry) params.industry = filters.industry;

      const response = await axios.get('/regional/training', { params });
      setTrainingData(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        alert('Please run skill shortage analysis first for this city');
      } else {
        alert('Failed to fetch training recommendations: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.city) {
      fetchTrainingData();
    }
  }, [filters.city]);

  const getTypeIcon = (type) => {
    const icons = {
      'bootcamp': '💻',
      'certification': '🎓',
      'apprenticeship': '🔧',
      'workshop': '📚',
      'degree-program': '🎓',
      'online-course': '💻'
    };
    return icons[type] || '📖';
  };

  const getAlignmentColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-blue-100 text-blue-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Regional Training Program Recommendations</h2>
        <p className="text-gray-600 mb-6">
          Discover training programs available in your city that address local skill shortages.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
              placeholder="e.g., San Francisco"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={filters.industry}
              onChange={(e) => setFilters({...filters, industry: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchTrainingData}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Training Recommendations'}
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading training recommendations...</p>
        </div>
      ) : trainingData && trainingData.recommendations ? (
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-blue-800">
              Found <strong>{trainingData.totalPrograms}</strong> training programs in <strong>{trainingData.city}</strong>
              {trainingData.industry && ` for ${trainingData.industry} industry`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingData.recommendations.map((rec, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-4xl">{getTypeIcon(rec.program.type)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{rec.program.title}</h3>
                      <p className="text-sm text-gray-600">{rec.program.provider}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getAlignmentColor(rec.demandAlignment.score)}`}>
                    {rec.demandAlignment.score}% match
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span>⏱ {rec.program.duration}</span>
                    <span>💰 {rec.program.cost.amount === 0 ? 'Free' : `$${rec.program.cost.amount.toLocaleString()} ${rec.program.cost.currency}`}</span>
                    <span>📱 {rec.program.format}</span>
                  </div>
                  {rec.program.cost.financialAid && (
                    <span className="inline-block bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                      Financial Aid Available
                    </span>
                  )}
                </div>

                {rec.program.skillsCovered && rec.program.skillsCovered.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Skills Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {rec.program.skillsCovered.map((skill, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {rec.demandAlignment && rec.demandAlignment.inDemandSkills && rec.demandAlignment.inDemandSkills.length > 0 && (
                  <div className="mb-4 bg-yellow-50 rounded-lg p-3">
                    <h4 className="font-semibold text-yellow-800 mb-1">Addresses Skill Shortage:</h4>
                    <p className="text-sm text-yellow-700">
                      {rec.demandAlignment.inDemandSkills.join(', ')} ({rec.demandAlignment.localJobOpportunities} local job opportunities)
                    </p>
                  </div>
                )}

                {rec.successMetrics && (
                  <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">Job Placement Rate</p>
                      <p className="font-semibold text-gray-800">{rec.successMetrics.employmentRate}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Avg Salary After</p>
                      <p className="font-semibold text-gray-800">${rec.program.averageSalaryAfter?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Completion Rate</p>
                      <p className="font-semibold text-gray-800">{rec.successMetrics.completionRate?.toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Salary Increase</p>
                      <p className="font-semibold text-gray-800">+{rec.successMetrics.salaryIncrease?.toFixed(0)}%</p>
                    </div>
                  </div>
                )}

                {rec.program.prerequisites && rec.program.prerequisites.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-1 text-sm">Prerequisites:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {rec.program.prerequisites.map((prereq, i) => (
                        <li key={i}>• {prereq}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  {rec.program.contact && (
                    <div className="text-xs text-gray-500">
                      <p>{rec.program.contact.email}</p>
                      {rec.program.contact.phone && <p>{rec.program.contact.phone}</p>}
                    </div>
                  )}
                  {rec.program.url && (
                    <a
                      href={rec.program.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      Learn More
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No training recommendations available. Please run skill shortage analysis first.</p>
        </div>
      )}
    </div>
  );
}

export default RegionalTrainingRecommendations;
