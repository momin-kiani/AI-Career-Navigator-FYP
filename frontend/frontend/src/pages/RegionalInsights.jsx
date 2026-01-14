// pages/RegionalInsights.jsx
import React, { useState } from 'react';
import RegionalHiringDashboard from '../components/regional/RegionalHiringDashboard';
import LocalSkillShortage from '../components/regional/LocalSkillShortage';
import SalaryBenchmarking from '../components/regional/SalaryBenchmarking';
import EmploymentOutcomeTracking from '../components/regional/EmploymentOutcomeTracking';
import RegionalTrainingRecommendations from '../components/regional/RegionalTrainingRecommendations';

function RegionalInsights() {
  const [activeTab, setActiveTab] = useState('hiring');

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Regional Insights</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('hiring')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'hiring'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Hiring Data
          </button>
          <button
            onClick={() => setActiveTab('shortage')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'shortage'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Skill Shortages
          </button>
          <button
            onClick={() => setActiveTab('salary')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'salary'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Salary Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('outcome')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'outcome'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Employment Outcomes
          </button>
          <button
            onClick={() => setActiveTab('training')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'training'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Training Programs
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'hiring' && <RegionalHiringDashboard />}
      {activeTab === 'shortage' && <LocalSkillShortage />}
      {activeTab === 'salary' && <SalaryBenchmarking />}
      {activeTab === 'outcome' && <EmploymentOutcomeTracking />}
      {activeTab === 'training' && <RegionalTrainingRecommendations />}
    </div>
  );
}

export default RegionalInsights;
