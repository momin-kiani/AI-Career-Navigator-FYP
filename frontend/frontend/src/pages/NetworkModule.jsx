// pages/NetworkModule.jsx
import React, { useState } from 'react';
import ContactsDashboard from '../components/network/ContactsDashboard';
import OpportunitiesDashboard from '../components/network/OpportunitiesDashboard';
import ElevatorPitch from '../components/network/ElevatorPitch';
import EmailWriter from '../components/network/EmailWriter';
import LinkedInReminders from '../components/network/LinkedInReminders';

function NetworkModule() {
  const [activeTab, setActiveTab] = useState('contacts'); // contacts, opportunities, pitch, email, reminders

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Network & Communication</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'contacts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Contacts
          </button>
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'opportunities'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Opportunities
          </button>
          <button
            onClick={() => setActiveTab('pitch')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'pitch'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Elevator Pitch
          </button>
          <button
            onClick={() => setActiveTab('email')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'email'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Email Writer
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'reminders'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            LinkedIn Reminders
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'contacts' && <ContactsDashboard />}
      {activeTab === 'opportunities' && <OpportunitiesDashboard />}
      {activeTab === 'pitch' && <ElevatorPitch />}
      {activeTab === 'email' && <EmailWriter />}
      {activeTab === 'reminders' && <LinkedInReminders />}
    </div>
  );
}

export default NetworkModule;
