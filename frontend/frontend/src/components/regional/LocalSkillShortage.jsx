// components/regional/LocalSkillShortage.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function LocalSkillShortage() {
  const [shortageData, setShortageData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: 'San Francisco',
    industry: ''
  });

  const fetchShortageData = async () => {
    setLoading(true);
    try {
      const params = { city: filters.city };
      if (filters.industry) params.industry = filters.industry;

      const response = await axios.get('/regional/skill-shortage', { params });
      setShortageData(response.data);
    } catch (error) {
      alert('Failed to fetch skill shortage data: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.city) {
      fetchShortageData();
    }
  }, [filters.city]);

  const getSeverityColor = (severity) => {
    const colors = {
      'critical': 'bg-red-100 text-red-700 border-red-300',
      'high': 'bg-orange-100 text-orange-700 border-orange-300',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'low': 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[severity] || colors.medium;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Local Skill Shortage Detection</h2>
        <p className="text-gray-600 mb-6">
          Identify skills in high demand but low supply in your city.
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
          onClick={fetchShortageData}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Skill Shortages'}
        </button>
      </div>

      {shortageData && shortageData.shortages && (
        <div className="space-y-6">
          {/* Insights */}
          {shortageData.insights && shortageData.insights.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Key Insights</h3>
              <ul className="space-y-2">
                {shortageData.insights.map((insight, index) => (
                  <li key={index} className="flex items-start text-blue-700">
                    <span className="mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skill Shortages */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Detected Skill Shortages</h3>
            <div className="space-y-4">
              {shortageData.shortages.map((shortage, index) => (
                <div key={index} className={`border-l-4 rounded-lg p-4 ${getSeverityColor(shortage.severity)}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-bold text-lg mb-1">{shortage.skill}</h4>
                      <p className="text-sm opacity-90">
                        Demand: {shortage.demandLevel}% | Supply: {shortage.supplyLevel}%
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-50">
                        {shortage.severity} severity
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 mt-3 text-sm">
                    <div>
                      <p className="opacity-75">Shortage Score</p>
                      <p className="font-bold text-lg">{shortage.shortageScore}/100</p>
                    </div>
                    <div>
                      <p className="opacity-75">Job Postings</p>
                      <p className="font-bold">{shortage.jobPostings}</p>
                    </div>
                    <div>
                      <p className="opacity-75">Time to Fill</p>
                      <p className="font-bold">{shortage.timeToFill} days</p>
                    </div>
                    <div>
                      <p className="opacity-75">Salary Premium</p>
                      <p className="font-bold">+{shortage.salaryPremium}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          {shortageData.recommendations && shortageData.recommendations.length > 0 && (
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {shortageData.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start text-green-700">
                    <span className="mr-2">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LocalSkillShortage;
