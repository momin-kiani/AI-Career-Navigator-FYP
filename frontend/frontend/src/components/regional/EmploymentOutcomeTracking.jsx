// components/regional/EmploymentOutcomeTracking.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function EmploymentOutcomeTracking() {
  const [outcomeData, setOutcomeData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: 'San Francisco',
    industry: ''
  });

  const fetchOutcomeData = async () => {
    setLoading(true);
    try {
      const params = { city: filters.city };
      if (filters.industry) params.industry = filters.industry;

      const response = await axios.get('/regional/employment-outcome', { params });
      setOutcomeData(response.data);
    } catch (error) {
      alert('Failed to fetch employment outcome data: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.city) {
      fetchOutcomeData();
    }
  }, [filters.city]);

  const getTrendColor = (direction) => {
    const colors = {
      'improving': 'text-green-600',
      'declining': 'text-red-600',
      'stable': 'text-gray-600'
    };
    return colors[direction] || colors.stable;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Employment Outcome Tracking</h2>
        <p className="text-gray-600 mb-6">
          Track employment rates, time to employment, and career progression by region.
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
          onClick={fetchOutcomeData}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Employment Outcomes'}
        </button>
      </div>

      {outcomeData && outcomeData.outcomes && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Employment Rate</h3>
              <p className="text-3xl font-bold">{outcomeData.outcomes.employmentRate}%</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Unemployment Rate</h3>
              <p className="text-3xl font-bold">{outcomeData.outcomes.unemploymentRate}%</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Time to Employment</h3>
              <p className="text-3xl font-bold">{outcomeData.outcomes.averageTimeToEmployment} days</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Job Growth Rate</h3>
              <p className="text-3xl font-bold">
                {outcomeData.outcomes.jobGrowthRate >= 0 ? '+' : ''}{outcomeData.outcomes.jobGrowthRate}%
              </p>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Retention Rate</h3>
              <p className="text-2xl font-bold text-gray-800">{outcomeData.outcomes.retentionRate}%</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Career Progression</h3>
              <p className="text-2xl font-bold text-gray-800">{outcomeData.outcomes.careerProgressionRate}%</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-2">Underemployment</h3>
              <p className="text-2xl font-bold text-gray-800">{outcomeData.outcomes.underemploymentRate}%</p>
            </div>
          </div>

          {/* Trends */}
          {outcomeData.trends && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Trends & Projections</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Direction</p>
                  <p className={`text-lg font-semibold capitalize ${getTrendColor(outcomeData.trends.direction)}`}>
                    {outcomeData.trends.direction}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Quarter</p>
                  <p className="text-lg font-bold text-gray-800">{outcomeData.trends.projections?.nextQuarter}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Next Year</p>
                  <p className="text-lg font-bold text-gray-800">{outcomeData.trends.projections?.nextYear}%</p>
                </div>
              </div>
              {outcomeData.trends.keyFactors && outcomeData.trends.keyFactors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Key Factors</h4>
                  <ul className="space-y-1">
                    {outcomeData.trends.keyFactors.map((factor, index) => (
                      <li key={index} className="text-sm text-gray-600">• {factor}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* By Role */}
          {outcomeData.byRole && outcomeData.byRole.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Outcomes by Role</h3>
              <div className="space-y-3">
                {outcomeData.byRole.map((role, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold text-gray-800">{role.role}</h4>
                        <p className="text-sm text-gray-600">
                          Employment Rate: {role.employmentRate.toFixed(1)}%
                        </p>
                      </div>
                      <div className="text-right">
                        {role.averageSalary > 0 && (
                          <p className="text-lg font-bold text-blue-600">
                            ${role.averageSalary.toLocaleString()}
                          </p>
                        )}
                        <p className="text-xs text-gray-500">Avg Salary</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* By Experience */}
          {outcomeData.byExperience && outcomeData.byExperience.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Outcomes by Experience Level</h3>
              <div className="grid grid-cols-3 gap-4">
                {outcomeData.byExperience.map((exp, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-2 capitalize">{exp.level} Level</h4>
                    <p className="text-sm text-gray-600 mb-1">
                      Employment Rate: <span className="font-semibold">{exp.employmentRate.toFixed(1)}%</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Avg Time: <span className="font-semibold">{Math.round(exp.averageTimeToEmployment)} days</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          {outcomeData.insights && outcomeData.insights.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Key Insights</h3>
              <ul className="space-y-2">
                {outcomeData.insights.map((insight, index) => (
                  <li key={index} className="flex items-start text-blue-700">
                    <span className="mr-2">•</span>
                    <span>{insight}</span>
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

export default EmploymentOutcomeTracking;
