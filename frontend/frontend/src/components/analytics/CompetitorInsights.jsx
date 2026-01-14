// components/analytics/CompetitorInsights.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function CompetitorInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState('');

  const fetchData = async () => {
    if (!company.trim()) {
      alert('Please enter a company name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('/analytics/competitor', {
        params: { company }
      });
      setData(response.data);
    } catch (error) {
      alert('Failed to fetch competitor data: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend) => {
    const colors = {
      'expanding': 'bg-green-100 text-green-700',
      'contracting': 'bg-red-100 text-red-700',
      'stable': 'bg-gray-100 text-gray-700'
    };
    return colors[trend] || colors.stable;
  };

  const getPositionColor = (position) => {
    const colors = {
      'above-market': 'bg-green-100 text-green-700',
      'at-market': 'bg-blue-100 text-blue-700',
      'below-market': 'bg-red-100 text-red-700'
    };
    return colors[position] || colors['at-market'];
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Competitor Hiring Insights</h2>
        <p className="text-gray-600 mb-6">
          Analyze hiring patterns, salary positioning, and focus areas of competitor companies.
        </p>

        <div className="flex space-x-4">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter company name (e.g., Tech Corp)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && fetchData()}
          />
          <button
            onClick={fetchData}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {data && data.hiringActivity && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Total Openings</h3>
              <p className="text-3xl font-bold">{data.hiringActivity.totalOpenings}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">New Postings</h3>
              <p className="text-3xl font-bold">{data.hiringActivity.newPostings}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Hiring Velocity</h3>
              <p className="text-3xl font-bold">{data.hiringActivity.hiringVelocity}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Time to Fill</h3>
              <p className="text-3xl font-bold">{Math.round(data.hiringActivity.averageTimeToFill)}d</p>
            </div>
          </div>

          {/* Hiring Trend */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Hiring Trend</h3>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-lg font-semibold ${getTrendColor(data.trends?.hiringTrend)}`}>
                {data.trends?.hiringTrend?.toUpperCase()}
              </span>
              <div className="text-sm text-gray-600">
                <p>Focus Areas: <strong>{data.trends?.focusAreas?.join(', ') || 'N/A'}</strong></p>
                <p>Growth Areas: <strong>{data.trends?.growthAreas?.join(', ') || 'N/A'}</strong></p>
              </div>
            </div>
          </div>

          {/* Salary Insights */}
          {data.salaryInsights && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Salary Insights</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average Salary</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${data.salaryInsights.averageSalary?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Salary Range</p>
                  <p className="text-lg font-semibold text-gray-800">
                    ${data.salaryInsights.salaryRange?.min?.toLocaleString()} - ${data.salaryInsights.salaryRange?.max?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Market Position</p>
                  <span className={`px-3 py-1 rounded-lg font-semibold ${getPositionColor(data.salaryInsights.competitivePosition)}`}>
                    {data.salaryInsights.competitivePosition?.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Top Roles */}
          {data.hiringActivity.roles && data.hiringActivity.roles.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Roles</h3>
              <div className="space-y-3">
                {data.hiringActivity.roles.slice(0, 10).map((role, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <div>
                      <span className="font-semibold text-gray-800">{role.title}</span>
                      <p className="text-sm text-gray-500">
                        {role.level} • {role.department}
                      </p>
                    </div>
                    <span className="text-blue-600 font-bold">{role.count} positions</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Departments */}
          {data.hiringActivity.departments && data.hiringActivity.departments.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Department Distribution</h3>
              <div className="space-y-3">
                {data.hiringActivity.departments.map((dept, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">{dept.department}</span>
                      <div className="flex items-center space-x-3">
                        <span className={`text-sm ${dept.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {dept.growth >= 0 ? '+' : ''}{dept.growth}%
                        </span>
                        <span className="text-blue-600 font-bold">{dept.openings} openings</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(dept.openings / data.hiringActivity.totalOpenings) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Requirements */}
          {data.skillRequirements && data.skillRequirements.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Skill Requirements</h3>
              <div className="flex flex-wrap gap-2">
                {data.skillRequirements.map((skill, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800">{skill.skill}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        skill.priority === 'high' ? 'bg-red-100 text-red-700' :
                        skill.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {skill.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{skill.frequency}% frequency</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CompetitorInsights;
