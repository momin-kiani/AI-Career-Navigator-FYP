// components/analytics/JobFeedDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function JobFeedDashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    industry: '',
    region: '',
    limit: 50
  });

  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.industry) params.industry = filters.industry;
      if (filters.region) params.region = filters.region;
      if (filters.limit) params.limit = filters.limit;

      const response = await axios.get('/analytics/job-feed', { params });
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error('Error fetching job feed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Real-Time Job Data Feed</h2>
        <p className="text-gray-600 mb-6">
          Live job postings from various sources, updated in real-time.
        </p>

        {/* Filters */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={filters.industry}
              onChange={(e) => setFilters({...filters, industry: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <input
              type="text"
              value={filters.region}
              onChange={(e) => setFilters({...filters, region: e.target.value})}
              placeholder="e.g., San Francisco, USA"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Limit</label>
            <select
              value={filters.limit}
              onChange={(e) => setFilters({...filters, limit: parseInt(e.target.value)})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchJobs}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Refresh Feed
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job feed...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <p className="text-sm text-gray-600">
              Showing <strong>{jobs.length}</strong> jobs
            </p>
          </div>
          {jobs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No jobs found. Try adjusting your filters.</p>
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id || job.jobId} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    <p className="text-sm text-gray-500">
                      📍 {job.location?.city || ''} {job.location?.state || ''} {job.location?.country || ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {job.industry}
                    </span>
                  </div>
                </div>

                {job.salary && (job.salary.min > 0 || job.salary.max > 0) && (
                  <div className="mb-4">
                    <p className="text-lg font-semibold text-gray-800">
                      ${job.salary.min?.toLocaleString()} - ${job.salary.max?.toLocaleString()} {job.salary.currency}
                    </p>
                  </div>
                )}

                {job.requiredSkills && job.requiredSkills.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Required Skills:</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.requiredSkills.slice(0, 8).map((skill, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>Posted: {new Date(job.postedDate).toLocaleDateString()}</span>
                  <span>Type: {job.jobType || 'Full-time'}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default JobFeedDashboard;
