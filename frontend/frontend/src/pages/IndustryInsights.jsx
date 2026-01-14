// pages/IndustryInsights.jsx
import React, { useState } from 'react';
import SkillGapAnalysis from '../components/industry/SkillGapAnalysis';
import EducationRecommendations from '../components/industry/EducationRecommendations';
import IndustryDemandTrends from '../components/industry/IndustryDemandTrends';
import EmployerStrategy from '../components/industry/EmployerStrategy';
import ExportReports from '../components/industry/ExportReports';

function IndustryInsights() {
  const [activeTab, setActiveTab] = useState('skill-gap'); // skill-gap, education, trends, strategy, export

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Industry Insights</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('skill-gap')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'skill-gap'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Skill Gap Analysis
          </button>
          <button
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'education'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Education & Courses
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'trends'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Demand Trends
          </button>
          <button
            onClick={() => setActiveTab('strategy')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'strategy'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Employer Strategy
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'export'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Export Reports
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'skill-gap' && <SkillGapAnalysis />}
      {activeTab === 'education' && <EducationRecommendations />}
      {activeTab === 'trends' && <IndustryDemandTrends />}
      {activeTab === 'strategy' && <EmployerStrategy />}
      {activeTab === 'export' && <ExportReports />}
    </div>
  );
}

export default IndustryInsights;
