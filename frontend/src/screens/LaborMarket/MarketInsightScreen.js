// ==========================================
// src/screens/LaborMarket/MarketInsightsScreen.js
// ==========================================
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

function MarketInsightsScreen() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await api.get('/market/insights');
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading market data..." />;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Labor Market Insights</h1>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">High Demand Jobs</h3>
            <p className="text-3xl font-bold">250+</p>
            <p className="text-blue-100 text-sm">Active openings</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Avg. Salary Growth</h3>
            <p className="text-3xl font-bold">+12%</p>
            <p className="text-green-100 text-sm">Year over year</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">Emerging Skills</h3>
            <p className="text-3xl font-bold">15+</p>
            <p className="text-purple-100 text-sm">Trending technologies</p>
          </div>
        </div>

        {insights.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No market data available</p>
          </div>
        ) : (
          insights.map((insight) => (
            <div key={insight._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{insight.jobTitle}</h3>
                  <p className="text-gray-600">{insight.industry}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">{insight.demandScore}/100</div>
                  <div className="text-sm text-gray-500">Demand Score</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Salary Range</h4>
                  <p className="text-lg font-bold text-gray-800">
                    ${insight.salaryRange?.min?.toLocaleString()} - ${insight.salaryRange?.max?.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">Median: ${insight.salaryRange?.median?.toLocaleString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Growth Projection</h4>
                  <p className="text-lg font-bold text-green-600">+{insight.growthProjection?.fiveYear}%</p>
                  <p className="text-sm text-gray-600">5-year forecast</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Top Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {insight.requiredSkills?.slice(0, 8).map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {skill.skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MarketInsightsScreen;