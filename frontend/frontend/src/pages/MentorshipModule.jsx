// pages/MentorshipModule.jsx
import React, { useState } from 'react';
import MentorMatching from '../components/mentorship/MentorMatching';
import CareerTransition from '../components/mentorship/CareerTransition';
import GrowthRoadmap from '../components/mentorship/GrowthRoadmap';
import MentorProgressTracker from '../components/mentorship/MentorProgressTracker';

function MentorshipModule() {
  const [activeTab, setActiveTab] = useState('matching'); // matching, transition, roadmap, progress

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Mentorship & Development</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('matching')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'matching'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Mentor Matching
          </button>
          <button
            onClick={() => setActiveTab('transition')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'transition'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Career Transition
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'roadmap'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Growth Roadmap
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'progress'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Progress Tracker
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'matching' && <MentorMatching />}
      {activeTab === 'transition' && <CareerTransition />}
      {activeTab === 'roadmap' && <GrowthRoadmap />}
      {activeTab === 'progress' && <MentorProgressTracker />}
    </div>
  );
}

export default MentorshipModule;
