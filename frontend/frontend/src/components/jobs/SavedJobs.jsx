// components/jobs/SavedJobs.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function SavedJobs({ onJobConverted }) {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobUrl: '',
    jobDescription: '',
    source: 'other',
    location: ''
  });

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      const response = await axios.get('/jobs/saved');
      setSavedJobs(response.data);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.jobUrl || !formData.jobTitle) {
      alert('Job URL and title are required');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/jobs/save-external', formData);
      setFormData({ jobTitle: '', company: '', jobUrl: '', jobDescription: '', source: 'other', location: '' });
      setShowForm(false);
      fetchSavedJobs();
      alert('Job saved successfully!');
    } catch (error) {
      alert('Failed to save job: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (jobId) => {
    try {
      await axios.post(`/jobs/saved/${jobId}/convert`);
      alert('Job converted to application successfully!');
      if (onJobConverted) onJobConverted();
      fetchSavedJobs();
    } catch (error) {
      alert('Failed to convert job: ' + (error.response?.data?.error || error.message));
    }
  };

  const sourceColors = {
    linkedin: 'bg-blue-100 text-blue-700',
    indeed: 'bg-purple-100 text-purple-700',
    glassdoor: 'bg-green-100 text-green-700',
    'company-website': 'bg-gray-100 text-gray-700',
    other: 'bg-yellow-100 text-yellow-700'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Saved Jobs from External Platforms</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Save Job'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Save Job from External Platform</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
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
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job URL *</label>
              <input
                type="url"
                required
                value={formData.jobUrl}
                onChange={(e) => setFormData({...formData, jobUrl: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({...formData, source: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="linkedin">LinkedIn</option>
                  <option value="indeed">Indeed</option>
                  <option value="glassdoor">Glassdoor</option>
                  <option value="company-website">Company Website</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description (Optional)</label>
              <textarea
                value={formData.jobDescription}
                onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                rows="6"
                placeholder="Paste job description for AI analysis..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Job'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No saved jobs yet. Save jobs from external platforms to track them!</p>
          </div>
        ) : (
          savedJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{job.jobTitle}</h3>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <a
                    href={job.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View Original →
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${sourceColors[job.source]}`}>
                    {job.source}
                  </span>
                  <button
                    onClick={() => handleConvert(job._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Convert to Application
                  </button>
                </div>
              </div>

              {job.summary && job.summary.keySkills && job.summary.keySkills.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-700 mb-2">Key Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.summary.keySkills.slice(0, 5).map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 text-sm text-gray-500">
                Saved {new Date(job.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SavedJobs;
