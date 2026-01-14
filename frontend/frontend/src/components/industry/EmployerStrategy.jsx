// components/industry/EmployerStrategy.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function EmployerStrategy() {
  const [strategies, setStrategies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    sector: 'Technology',
    region: ''
  });

  const fetchStrategies = async () => {
    setLoading(true);
    try {
      const params = { sector: filters.sector };
      if (filters.region) params.region = filters.region;

      const response = await axios.get('/industry/employer-strategy', { params });
      setStrategies(response.data);
    } catch (error) {
      alert('Failed to fetch strategies: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.sector) {
      fetchStrategies();
    }
  }, [filters.sector]);

  const getPriorityColor = (priority) => {
    const colors = {
      'high': 'bg-red-100 text-red-700 border-red-300',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'low': 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[priority] || colors.medium;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'hiring': '👥',
      'retention': '💼',
      'skill-development': '📚',
      'compensation': '💰',
      'workplace-culture': '🌟'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Employer Strategy Suggestions</h2>
        <p className="text-gray-600 mb-6">
          Strategic recommendations for employers based on market analysis.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
            <select
              value={filters.sector}
              onChange={(e) => setFilters({...filters, sector: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region (Optional)</label>
            <input
              type="text"
              value={filters.region}
              onChange={(e) => setFilters({...filters, region: e.target.value})}
              placeholder="e.g., San Francisco"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={fetchStrategies}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Strategies'}
        </button>
      </div>

      {strategies && strategies.strategies && (
        <div className="space-y-6">
          {/* Insights */}
          {strategies.insights && strategies.insights.length > 0 && (
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-purple-800 mb-4">Analysis Insights</h3>
              <ul className="space-y-2">
                {strategies.insights.map((insight, index) => (
                  <li key={index} className="flex items-start text-purple-700">
                    <span className="mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strategies */}
          <div className="space-y-4">
            {strategies.strategies.map((strategy, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getCategoryIcon(strategy.category)}</span>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{strategy.title}</h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {strategy.category.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(strategy.priority)}`}>
                      {strategy.priority} priority
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      strategy.impact === 'high' ? 'bg-green-100 text-green-700' :
                      strategy.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {strategy.impact} impact
                    </span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{strategy.description}</p>

                {/* Implementation */}
                {strategy.implementation && (
                  <div className="mb-4 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-800 mb-3">Implementation Plan</h4>
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Timeline</p>
                        <p className="font-semibold text-gray-800">{strategy.implementation.timeline}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Estimated Cost</p>
                        <p className="font-semibold text-gray-800">
                          ${strategy.implementation.estimatedCost?.amount?.toLocaleString()} {strategy.implementation.estimatedCost?.currency}
                        </p>
                      </div>
                    </div>
                    {strategy.implementation.steps && strategy.implementation.steps.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2">Steps:</p>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
                          {strategy.implementation.steps.map((step, i) => (
                            <li key={i}>{step}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {strategy.implementation.resources && strategy.implementation.resources.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Resources Needed:</p>
                        <div className="flex flex-wrap gap-2">
                          {strategy.implementation.resources.map((resource, i) => (
                            <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                              {resource}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Success Metrics */}
                {strategy.successMetrics && strategy.successMetrics.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Success Metrics</h4>
                    <ul className="space-y-1">
                      {strategy.successMetrics.map((metric, i) => (
                        <li key={i} className="flex items-start text-sm text-gray-600">
                          <span className="text-green-500 mr-2">✓</span>
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Examples */}
                {strategy.examples && strategy.examples.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Examples</h4>
                    <ul className="space-y-1">
                      {strategy.examples.map((example, i) => (
                        <li key={i} className="text-sm text-gray-600">
                          • {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployerStrategy;
