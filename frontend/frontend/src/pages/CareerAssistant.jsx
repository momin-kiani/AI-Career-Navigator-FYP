// pages/CareerAssistant.jsx
import React, { useState } from 'react';
import EnhancedChatbot from '../components/assistant/EnhancedChatbot';
import ResumeFeedback from '../components/assistant/ResumeFeedback';
import JobSuggestions from '../components/assistant/JobSuggestions';
import CareerTips from '../components/assistant/CareerTips';
import SmartAlerts from '../components/assistant/SmartAlerts';

function CareerAssistant() {
  const [activeTab, setActiveTab] = useState('chatbot'); // chatbot, feedback, jobs, tips, alerts

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Intelligent Career Assistant</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('chatbot')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'chatbot'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            AI Chatbot
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'feedback'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Resume Feedback
          </button>
          <button
            onClick={() => setActiveTab('jobs')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'jobs'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Job Suggestions
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'tips'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Career Tips
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'alerts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Smart Alerts
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'chatbot' && <EnhancedChatbot />}
      {activeTab === 'feedback' && <ResumeFeedback />}
      {activeTab === 'jobs' && <JobSuggestions />}
      {activeTab === 'tips' && <CareerTips />}
      {activeTab === 'alerts' && <SmartAlerts />}
    </div>
  );
}

export default CareerAssistant;
