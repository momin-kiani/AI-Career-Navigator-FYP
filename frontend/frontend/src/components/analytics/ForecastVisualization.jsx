// components/analytics/ForecastVisualization.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function ForecastVisualization() {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: 'Software Engineer',
    industry: 'Technology',
    region: ''
  });

  const fetchForecast = async () => {
    if (!formData.jobTitle || !formData.industry) {
      alert('Please fill in job title and industry');
      return;
    }

    setLoading(true);
    try {
      const params = {
        jobTitle: formData.jobTitle,
        industry: formData.industry
      };
      if (formData.region) params.region = formData.region;

      const response = await axios.get('/analytics/forecast', { params });
      setForecast(response.data);
    } catch (error) {
      alert('Failed to generate forecast: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const getTrendColor = (trend) => {
    const colors = {
      'strong-growth': 'bg-green-100 text-green-700',
      'moderate-growth': 'bg-blue-100 text-blue-700',
      'stable': 'bg-gray-100 text-gray-700',
      'declining': 'bg-red-100 text-red-700'
    };
    return colors[trend] || colors.stable;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Five-Year Demand Forecast</h2>
        <p className="text-gray-600 mb-6">
          Generate demand forecasts with projections, trends, and key insights.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
            <input
              type="text"
              required
              value={formData.jobTitle}
              onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
              placeholder="e.g., Software Engineer"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
            <select
              value={formData.industry}
              onChange={(e) => setFormData({...formData, industry: e.target.value})}
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
              value={formData.region}
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              placeholder="e.g., San Francisco"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={fetchForecast}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Generating Forecast...' : 'Generate Forecast'}
        </button>
      </div>

      {forecast && forecast.projections && (
        <div className="space-y-6">
          {/* Overall Trend */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Overall Forecast Trend</h3>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-lg font-semibold bg-white bg-opacity-20 ${getTrendColor(forecast.trends?.overallTrend)}`}>
                {forecast.trends?.overallTrend?.replace('-', ' ').toUpperCase()}
              </span>
              <div className="text-sm opacity-90">
                <p>Confidence Level: <strong>{forecast.methodology?.confidenceLevel}%</strong></p>
                <p>Forecast Period: <strong>{forecast.forecastPeriod?.startYear} - {forecast.forecastPeriod?.endYear}</strong></p>
              </div>
            </div>
          </div>

          {/* Year-by-Year Projections */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Five-Year Projections</h3>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((year) => {
                const yearData = forecast.projections[`year${year}`];
                if (!yearData) return null;

                return (
                  <div key={year} className="border-l-4 border-blue-500 pl-6 py-4 bg-gray-50 rounded-r-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">Year {year}</h4>
                        <p className="text-sm text-gray-500">
                          {forecast.forecastPeriod?.startYear + year - 1}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600">{yearData.demandScore}</p>
                        <p className="text-xs text-gray-500">Demand Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Expected Openings</p>
                        <p className="text-lg font-bold text-gray-800">{yearData.expectedOpenings?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Salary Projection</p>
                        <p className="text-lg font-bold text-green-600">
                          ${yearData.salaryProjection?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
                        <p className="text-lg font-bold text-purple-600">
                          +{yearData.growthRate}%
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${yearData.demandScore}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Key Drivers */}
          {forecast.trends?.keyDrivers && forecast.trends.keyDrivers.length > 0 && (
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-green-800 mb-4">Key Drivers</h3>
              <ul className="space-y-2">
                {forecast.trends.keyDrivers.map((driver, index) => (
                  <li key={index} className="flex items-start text-green-700">
                    <span className="mr-2">✓</span>
                    <span>{driver}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Risks */}
          {forecast.trends?.risks && forecast.trends.risks.length > 0 && (
            <div className="bg-red-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-red-800 mb-4">Risks</h3>
              <ul className="space-y-2">
                {forecast.trends.risks.map((risk, index) => (
                  <li key={index} className="flex items-start text-red-700">
                    <span className="mr-2">⚠</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Opportunities */}
          {forecast.trends?.opportunities && forecast.trends.opportunities.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Opportunities</h3>
              <ul className="space-y-2">
                {forecast.trends.opportunities.map((opp, index) => (
                  <li key={index} className="flex items-start text-blue-700">
                    <span className="mr-2">🎯</span>
                    <span>{opp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Methodology */}
          {forecast.methodology && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Forecast Methodology</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Data Sources</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {forecast.methodology.dataSources?.map((source, i) => (
                      <li key={i}>{source}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Assumptions</h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {forecast.methodology.assumptions?.map((assumption, i) => (
                      <li key={i}>{assumption}</li>
                    ))}
                  </ul>
                </div>
                {forecast.methodology.factors && forecast.methodology.factors.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">Key Factors</h4>
                    <div className="space-y-2">
                      {forecast.methodology.factors.map((factor, i) => (
                        <div key={i} className="border-l-4 border-blue-500 pl-4">
                          <p className="font-semibold text-gray-800">{factor.factor}</p>
                          <p className="text-sm text-gray-600">{factor.description}</p>
                          <p className="text-xs text-gray-500">Impact: {factor.impact * 100}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ForecastVisualization;
