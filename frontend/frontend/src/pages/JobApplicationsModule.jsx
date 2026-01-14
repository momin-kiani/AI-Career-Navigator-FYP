// pages/JobApplicationsModule.jsx
import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import JobDetailView from '../components/jobs/JobDetailView';
import AutofillApplication from '../components/jobs/AutofillApplication';
import JobSummarizer from '../components/jobs/JobSummarizer';
import SavedJobs from '../components/jobs/SavedJobs';

function JobApplicationsModule() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [activeTab, setActiveTab] = useState('tracker'); // tracker, autofill, summarize, saved
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobUrl: '',
    jobDescription: '',
    status: 'saved'
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/jobs/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/jobs/applications', formData);
      setFormData({ jobTitle: '', company: '', jobUrl: '', jobDescription: '', status: 'saved' });
      setShowForm(false);
      fetchApplications();
      alert('Application added successfully!');
    } catch (error) {
      alert('Failed to add application: ' + (error.response?.data?.error || error.message));
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/jobs/applications/${id}`, { status });
      fetchApplications();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleViewDetails = async (id) => {
    try {
      const response = await axios.get(`/jobs/applications/${id}`);
      setSelectedJob(response.data);
    } catch (error) {
      alert('Failed to load job details');
    }
  };

  const statusColors = {
    saved: 'bg-gray-100 text-gray-700',
    applied: 'bg-blue-100 text-blue-700',
    interviewing: 'bg-yellow-100 text-yellow-700',
    offered: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    accepted: 'bg-purple-100 text-purple-700',
    withdrawn: 'bg-orange-100 text-orange-700'
  };

  if (selectedJob) {
    return (
      <JobDetailView
        job={selectedJob}
        onBack={() => setSelectedJob(null)}
        onUpdate={fetchApplications}
      />
    );
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Job Application Management</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add Application'}
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'tracker'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Job Tracker
          </button>
          <button
            onClick={() => setActiveTab('autofill')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'autofill'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Autofill
          </button>
          <button
            onClick={() => setActiveTab('summarize')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'summarize'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Summarize Job
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'saved'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Saved Jobs
          </button>
        </div>
      </div>

      {/* Job Tracker Tab */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          {showForm && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Application</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                    <input
                      type="text"
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                    <input
                      type="text"
                      required
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job URL</label>
                  <input
                    type="url"
                    value={formData.jobUrl}
                    onChange={(e) => setFormData({...formData, jobUrl: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Description (Optional)</label>
                  <textarea
                    value={formData.jobDescription}
                    onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Paste job description for AI analysis..."
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Add Application
                </button>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 gap-4">
            {applications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">No applications yet. Start tracking your job search!</p>
              </div>
            ) : (
              applications.map((app) => (
                <div key={app._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{app.jobTitle}</h3>
                      <p className="text-gray-600 mb-2">{app.company}</p>
                      {app.jobUrl && (
                        <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                          View Job Posting →
                        </a>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      {app.skillMatch && app.skillMatch.score !== undefined && (
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">{app.skillMatch.score}%</div>
                          <div className="text-xs text-gray-500">Match</div>
                        </div>
                      )}
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        className={`px-4 py-2 rounded-lg font-semibold ${statusColors[app.status]}`}
                      >
                        <option value="saved">Saved</option>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offered">Offered</option>
                        <option value="rejected">Rejected</option>
                        <option value="accepted">Accepted</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>📅 Added {new Date(app.createdAt).toLocaleDateString()}</span>
                      {app.appliedDate && (
                        <span>✉️ Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                      )}
                      {app.location && <span>📍 {app.location}</span>}
                    </div>
                    <button
                      onClick={() => handleViewDetails(app._id)}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Autofill Tab */}
      {activeTab === 'autofill' && (
        <AutofillApplication onApplicationCreated={fetchApplications} />
      )}

      {/* Summarize Tab */}
      {activeTab === 'summarize' && (
        <JobSummarizer />
      )}

      {/* Saved Jobs Tab */}
      {activeTab === 'saved' && (
        <SavedJobs onJobConverted={fetchApplications} />
      )}
    </div>
  );
}

export default JobApplicationsModule;
