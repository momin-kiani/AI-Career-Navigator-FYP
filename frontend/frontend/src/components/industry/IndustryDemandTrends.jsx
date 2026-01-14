// components/industry/IndustryDemandTrends.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function IndustryDemandTrends() {
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sector, setSector] = useState('Technology');

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/industry/demand-trends', {
        params: { sector }
      });
      setTrends(response.data);
    } catch (error) {
      alert('Failed to fetch trends: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sector) {
      fetchTrends();
    }
  }, [sector]);

  const getForecastColor = (forecast) => {
    const colors = {
      'strong-growth': 'bg-green-100 text-green-700',
      'moderate-growth': 'bg-blue-100 text-blue-700',
      'stable': 'bg-gray-100 text-gray-700',
      'declining': 'bg-red-100 text-red-700'
    };
    return colors[forecast] || colors.stable;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Industry Demand Trends</h2>
        <p className="text-gray-600 mb-6">
          Analyze demand trends, emerging skills, and salary growth in your sector.
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
          onClick={fetchTrends}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Trends'}
        </button>
      </div>

      {trends && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Total Jobs</h3>
              <p className="text-3xl font-bold">{trends.totalJobs}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Growth Rate</h3>
              <p className="text-3xl font-bold">
                {trends.growthRate >= 0 ? '+' : ''}{trends.growthRate}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Recent Jobs</h3>
              <p className="text-3xl font-bold">{trends.recentJobs}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Previous Period</h3>
              <p className="text-3xl font-bold">{trends.previousJobs}</p>
            </div>
          </div>

          {/* Demand Forecast */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Demand Forecast</h3>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-lg font-semibold ${getForecastColor(trends.demandForecast)}`}>
                {trends.demandForecast?.replace('-', ' ').toUpperCase()}
              </span>
              <p className="text-gray-600">
                Based on {trends.recentJobs} recent postings vs {trends.previousJobs} in previous period
              </p>
            </div>
          </div>

          {/* Emerging Skills */}
          {trends.emergingSkills && trends.emergingSkills.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Emerging Skills</h3>
              <p className="text-sm text-gray-600 mb-4">
                Skills showing significant growth in demand
              </p>
              <div className="space-y-3">
                {trends.emergingSkills.map((skill, index) => (
                  <div key={index} className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-gray-800">{skill.skill}</h4>
                        <p className="text-sm text-gray-600">
                          Appears in {skill.frequency} recent job postings
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">
                          +{Math.round(skill.growth)}%
                        </p>
                        <p className="text-xs text-gray-500">Growth</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salary Trends */}
          {trends.salaryTrends && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Salary Trends</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Current Average</p>
                  <p className="text-2xl font-bold text-gray-800">
                    ${trends.salaryTrends.current?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Previous Average</p>
                  <p className="text-2xl font-bold text-gray-700">
                    ${trends.salaryTrends.previous?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Growth</p>
                  <p className={`text-2xl font-bold ${
                    trends.salaryTrends.growth >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {trends.salaryTrends.growth >= 0 ? '+' : ''}{trends.salaryTrends.growth}%
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Momentum Metrics */}
          {trends.momentum && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Hiring Momentum</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Momentum Score</p>
                  <p className="text-3xl font-bold text-blue-600">{trends.momentum.score}/100</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Direction</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {trends.momentum.direction}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          {trends.insights && trends.insights.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Key Insights</h3>
              <ul className="space-y-2">
                {trends.insights.map((insight, index) => (
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

export default IndustryDemandTrends;
