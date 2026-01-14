// components/analytics/IndustryMomentum.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function IndustryMomentum() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [industry, setIndustry] = useState('Technology');

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/analytics/industry-momentum', {
        params: { industry }
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching momentum data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [industry]);

  const getMomentumColor = (score) => {
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTrendColor = (trend) => {
    const colors = {
      'rapid-growth': 'bg-green-100 text-green-700',
      'steady-growth': 'bg-blue-100 text-blue-700',
      'stable': 'bg-gray-100 text-gray-700',
      'declining': 'bg-red-100 text-red-700'
    };
    return colors[trend] || colors.stable;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Industry Hiring Momentum</h2>
        <p className="text-gray-600 mb-6">
          Track hiring velocity, growth trends, and skill demand by industry.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
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
          onClick={fetchData}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Momentum'}
        </button>
      </div>

      {data && data.momentum && (
        <div className="space-y-6">
          {/* Momentum Score */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Momentum Score</h3>
            <div className="flex items-center space-x-6">
              <div className="text-5xl font-bold">{data.momentum.score}/100</div>
              <div>
                <p className="text-lg font-semibold">Direction: {data.momentum.direction}</p>
                <p className="text-sm opacity-90">Change Rate: {data.momentum.changeRate}%</p>
                <p className="text-sm opacity-90">Hiring Velocity: {data.momentum.hiringVelocity} jobs/week</p>
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-white bg-opacity-20 rounded-full h-4">
                <div
                  className={`h-4 rounded-full ${getMomentumColor(data.momentum.score)}`}
                  style={{ width: `${data.momentum.score}%` }}
                />
              </div>
            </div>
          </div>

          {/* Growth Trend */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Growth Trend</h3>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-lg font-semibold ${getTrendColor(data.momentum.growthTrend)}`}>
                {data.momentum.growthTrend?.replace('-', ' ').toUpperCase()}
              </span>
              <div className="text-sm text-gray-600">
                <p>Total Postings: <strong>{data.metrics?.totalPostings}</strong></p>
                <p>New Postings: <strong>{data.metrics?.newPostings}</strong></p>
                <p>Avg. Time to Fill: <strong>{Math.round(data.metrics?.averageTimeToFill)} days</strong></p>
              </div>
            </div>
          </div>

          {/* Skill Demand */}
          {data.metrics?.skillDemand && data.metrics.skillDemand.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top In-Demand Skills</h3>
              <div className="space-y-3">
                {data.metrics.skillDemand.map((skill, index) => (
                  <div key={index} className="border-b border-gray-200 pb-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">{skill.skill}</span>
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          skill.trend === 'rising' ? 'bg-green-100 text-green-700' :
                          skill.trend === 'falling' ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {skill.trend}
                        </span>
                        <span className="text-blue-600 font-bold">{skill.demandScore}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${skill.demandScore}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Salary Trends */}
          {data.metrics?.salaryTrends && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Salary Trends</h3>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Average</p>
                  <p className="text-xl font-bold text-gray-800">
                    ${data.metrics.salaryTrends.average?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Growth</p>
                  <p className="text-xl font-bold text-green-600">
                    +{data.metrics.salaryTrends.growth}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">25th Percentile</p>
                  <p className="text-xl font-bold text-gray-700">
                    ${data.metrics.salaryTrends.percentile25?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">75th Percentile</p>
                  <p className="text-xl font-bold text-gray-700">
                    ${data.metrics.salaryTrends.percentile75?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Insights */}
          {data.insights && data.insights.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Key Insights</h3>
              <ul className="space-y-2">
                {data.insights.map((insight, index) => (
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

export default IndustryMomentum;
