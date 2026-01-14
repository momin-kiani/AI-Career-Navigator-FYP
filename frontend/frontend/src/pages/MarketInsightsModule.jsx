// pages/MarketInsightsModule.jsx
import React, { useState } from 'react';
import JobFeedDashboard from '../components/analytics/JobFeedDashboard';
import RegionalHiring from '../components/analytics/RegionalHiring';
import IndustryMomentum from '../components/analytics/IndustryMomentum';
import CompetitorInsights from '../components/analytics/CompetitorInsights';
import ForecastVisualization from '../components/analytics/ForecastVisualization';

function MarketInsightsModule() {
  const [activeTab, setActiveTab] = useState('feed'); // feed, regional, momentum, competitor, forecast

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Labor Market Analytics</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('feed')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'feed'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Job Feed
          </button>
          <button
            onClick={() => setActiveTab('regional')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'regional'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Regional Hiring
          </button>
          <button
            onClick={() => setActiveTab('momentum')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'momentum'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Industry Momentum
          </button>
          <button
            onClick={() => setActiveTab('competitor')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'competitor'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Competitor Insights
          </button>
          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'forecast'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Forecast
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'feed' && <JobFeedDashboard />}
      {activeTab === 'regional' && <RegionalHiring />}
      {activeTab === 'momentum' && <IndustryMomentum />}
      {activeTab === 'competitor' && <CompetitorInsights />}
      {activeTab === 'forecast' && <ForecastVisualization />}
    </div>
  );
}

export default MarketInsightsModule;
