// components/assistant/JobSuggestions.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function JobSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState({
    keywords: '',
    location: '',
    jobType: '',
    experienceLevel: ''
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const params = {};
      if (query.keywords) params.keywords = query.keywords;
      if (query.location) params.location = query.location;
      if (query.jobType) params.jobType = query.jobType;
      if (query.experienceLevel) params.experienceLevel = query.experienceLevel;

      const response = await axios.get('/assistant/job-search', { params });
      const suggestionsData = response.data?.suggestions || response.data || [];
      setSuggestions(Array.isArray(suggestionsData) ? suggestionsData : []);
      
      if (suggestionsData.length === 0) {
        alert('No job suggestions found. Try adjusting your search criteria.');
      }
    } catch (error) {
      console.error('Error getting job suggestions:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to get job suggestions';
      alert(`Error: ${errorMsg}`);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Personalized Job Search</h2>
        <p className="text-gray-600 mb-6">
          Get AI-powered job suggestions based on your profile, skills, and preferences.
        </p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Keywords</label>
              <input
                type="text"
                value={query.keywords}
                onChange={(e) => setQuery({...query, keywords: e.target.value})}
                placeholder="e.g., software engineer, python"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                value={query.location}
                onChange={(e) => setQuery({...query, location: e.target.value})}
                placeholder="e.g., New York, Remote"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
              <select
                value={query.jobType}
                onChange={(e) => setQuery({...query, jobType: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
              <select
                value={query.experienceLevel}
                onChange={(e) => setQuery({...query, experienceLevel: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any</option>
                <option value="entry">Entry Level</option>
                <option value="mid">Mid Level</option>
                <option value="senior">Senior Level</option>
                <option value="executive">Executive</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Get Job Suggestions'}
          </button>
        </form>
      </div>

      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800">Job Suggestions</h3>
          {suggestions.map((job, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-gray-800 mb-1">{job.jobTitle}</h4>
                  <p className="text-gray-600 mb-2">{job.company}</p>
                  <p className="text-gray-500 text-sm">📍 {job.location}</p>
                </div>
                <div className={`px-4 py-2 rounded-lg font-semibold ${getMatchColor(job.matchScore)}`}>
                  {job.matchScore}% Match
                </div>
              </div>

              {job.reasons && job.reasons.length > 0 && (
                <div className="mb-4">
                  <h5 className="font-semibold text-gray-700 mb-2">Why this matches:</h5>
                  <ul className="space-y-1">
                    {job.reasons.map((reason, i) => (
                      <li key={i} className="flex items-start text-sm text-gray-600">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {job.jobUrl && (
                <a
                  href={job.jobUrl}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition inline-block"
                >
                  View Details
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default JobSuggestions;
