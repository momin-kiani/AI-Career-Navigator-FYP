// components/mentorship/MentorProgressTracker.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function MentorProgressTracker() {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    entryType: 'milestone',
    title: '',
    description: '',
    progress: 0,
    tags: ''
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/mentorship/progress');
      setProgressData(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      };
      await axios.post('/mentorship/progress', data);
      setFormData({ entryType: 'milestone', title: '', description: '', progress: 0, tags: '' });
      setShowForm(false);
      fetchProgress();
      alert('Progress logged successfully!');
    } catch (error) {
      alert('Failed to log progress: ' + (error.response?.data?.error || error.message));
    }
  };

  const getEntryIcon = (type) => {
    const icons = {
      'milestone': '🎯',
      'goal': '🎯',
      'skill-development': '📚',
      'feedback': '💬',
      'meeting': '🤝',
      'reflection': '📝'
    };
    return icons[type] || '📝';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading progress...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Progress Tracker</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Log Progress'}
        </button>
      </div>

      {/* Progress Analysis */}
      {progressData && progressData.analysis && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Progress Overview</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{progressData.analysis.overallProgress}%</div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{progressData.analysis.completedMilestones}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{progressData.analysis.inProgressMilestones}</div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">{progressData.analysis.blockedMilestones}</div>
              <div className="text-sm text-gray-600">Blocked</div>
            </div>
          </div>

          {progressData.analysis.recommendations && progressData.analysis.recommendations.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Recommendations:</h4>
              <ul className="space-y-1">
                {progressData.analysis.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-blue-700">• {rec}</li>
                ))}
              </ul>
            </div>
          )}

          {progressData.analysis.mentorInsights && progressData.analysis.mentorInsights.length > 0 && (
            <div className="mt-4 bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Mentor Insights:</h4>
              {progressData.analysis.mentorInsights.map((insight, index) => (
                <div key={index} className="mb-2">
                  <p className="text-sm font-semibold text-purple-700">{insight.mentorName}:</p>
                  <p className="text-sm text-purple-600">{insight.insight}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Log Progress Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Log Progress Entry</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Entry Type</label>
              <select
                value={formData.entryType}
                onChange={(e) => setFormData({...formData, entryType: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="milestone">Milestone</option>
                <option value="goal">Goal</option>
                <option value="skill-development">Skill Development</option>
                <option value="feedback">Feedback</option>
                <option value="meeting">Meeting</option>
                <option value="reflection">Reflection</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.progress}
                onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma-separated)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="e.g., skill, networking, achievement"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Log Progress
            </button>
          </form>
        </div>
      )}

      {/* Progress Entries */}
      {progressData && progressData.entries && progressData.entries.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Progress Entries</h3>
          <div className="space-y-4">
            {progressData.entries.map((entry) => (
              <div key={entry._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{getEntryIcon(entry.entryType)}</span>
                    <div>
                      <h4 className="font-bold text-gray-800">{entry.title}</h4>
                      <span className="text-xs text-gray-500">{entry.entryType.replace(/-/g, ' ')}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-600">{entry.progress}%</div>
                    <div className="text-xs text-gray-400">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {entry.description && (
                  <p className="text-gray-600 mb-3">{entry.description}</p>
                )}

                {entry.progress > 0 && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${entry.progress}%` }}
                    />
                  </div>
                )}

                {entry.mentorFeedback && entry.mentorFeedback.feedback && (
                  <div className="bg-purple-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-semibold text-purple-800 mb-1">Mentor Feedback:</p>
                    <p className="text-sm text-purple-700">{entry.mentorFeedback.feedback}</p>
                  </div>
                )}

                {entry.tags && entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, i) => (
                      <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {progressData && (!progressData.entries || progressData.entries.length === 0) && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No progress entries yet. Start logging your progress!</p>
        </div>
      )}
    </div>
  );
}

export default MentorProgressTracker;
