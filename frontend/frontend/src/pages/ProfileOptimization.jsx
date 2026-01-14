// pages/ProfileOptimization.jsx
import React, { useState } from 'react';
import ProfileCompleteness from '../components/profile/ProfileCompleteness';
import ProfileChecklist from '../components/profile/ProfileChecklist';
import AIHeadlineSummary from '../components/profile/AIHeadlineSummary';
import LinkedInPostWriter from '../components/profile/LinkedInPostWriter';
import BadgeDisplay from '../components/profile/BadgeDisplay';

function ProfileOptimization() {
  const [activeTab, setActiveTab] = useState('completeness'); // completeness, checklist, headline, post, badges

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Profile Optimization</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('completeness')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'completeness'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Completeness
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'checklist'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Checklist
          </button>
          <button
            onClick={() => setActiveTab('headline')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'headline'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            AI Headline & Summary
          </button>
          <button
            onClick={() => setActiveTab('post')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'post'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            LinkedIn Posts
          </button>
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'badges'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Badges
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'completeness' && <ProfileCompleteness />}
      {activeTab === 'checklist' && <ProfileChecklist />}
      {activeTab === 'headline' && <AIHeadlineSummary />}
      {activeTab === 'post' && <LinkedInPostWriter />}
      {activeTab === 'badges' && <BadgeDisplay />}
    </div>
  );
}

export default ProfileOptimization;
