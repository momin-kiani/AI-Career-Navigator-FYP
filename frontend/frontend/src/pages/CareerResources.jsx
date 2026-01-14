// pages/CareerResources.jsx
import React, { useState } from 'react';
import ProgressDashboard from '../components/career/ProgressDashboard';
import DocumentHub from '../components/career/DocumentHub';
import ResourceLibrary from '../components/career/ResourceLibrary';
import ActivityTimeline from '../components/career/ActivityTimeline';
import VisualReports from '../components/career/VisualReports';

function CareerResources() {
  const [activeTab, setActiveTab] = useState('progress'); // progress, documents, resources, activity, reports

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Career Resources</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('progress')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'progress'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Progress
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'documents'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'resources'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'activity'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'reports'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Reports
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'progress' && <ProgressDashboard />}
      {activeTab === 'documents' && <DocumentHub />}
      {activeTab === 'resources' && <ResourceLibrary />}
      {activeTab === 'activity' && <ActivityTimeline />}
      {activeTab === 'reports' && <VisualReports />}
    </div>
  );
}

export default CareerResources;
