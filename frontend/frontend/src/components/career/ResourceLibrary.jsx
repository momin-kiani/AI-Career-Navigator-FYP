// components/career/ResourceLibrary.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function ResourceLibrary() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, selectedType]);

  const fetchResources = async () => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedType !== 'all') params.resourceType = selectedType;
      
      const response = await axios.get('/career/resources', { params });
      setResources(response.data);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const getResourceIcon = (type) => {
    const icons = {
      guide: '📖',
      pdf: '📄',
      video: '🎥',
      link: '🔗',
      template: '📋',
      checklist: '✅'
    };
    return icons[type] || '📎';
  };

  const categoryColors = {
    resume: 'bg-blue-100 text-blue-700',
    interview: 'bg-green-100 text-green-700',
    networking: 'bg-purple-100 text-purple-700',
    'career-planning': 'bg-yellow-100 text-yellow-700',
    'skill-development': 'bg-pink-100 text-pink-700',
    'job-search': 'bg-orange-100 text-orange-700',
    general: 'bg-gray-100 text-gray-700'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading resources...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Resource Library</h2>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="resume">Resume</option>
              <option value="interview">Interview</option>
              <option value="networking">Networking</option>
              <option value="career-planning">Career Planning</option>
              <option value="skill-development">Skill Development</option>
              <option value="job-search">Job Search</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="guide">Guide</option>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="link">Link</option>
              <option value="template">Template</option>
              <option value="checklist">Checklist</option>
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {resources.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No resources available in this category.</p>
          </div>
        ) : (
          resources.map((resource) => (
            <div key={resource._id} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{getResourceIcon(resource.resourceType)}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{resource.title}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${categoryColors[resource.category] || categoryColors.general}`}>
                      {resource.category}
                    </span>
                  </div>
                </div>
              </div>

              {resource.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">{resource.description}</p>
              )}

              {resource.tags && resource.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  {resource.views || 0} views
                </div>
                {resource.fileUrl && (
                  <a
                    href={resource.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    View
                  </a>
                )}
                {resource.externalUrl && (
                  <a
                    href={resource.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                  >
                    Open Link
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ResourceLibrary;
