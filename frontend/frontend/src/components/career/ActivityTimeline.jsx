// components/career/ActivityTimeline.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function ActivityTimeline() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchActivities();
  }, [selectedType]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (selectedType !== 'all') params.activityType = selectedType;
      
      const response = await axios.get('/career/activity', { params });
      setActivities(response.data);
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type) => {
    const icons = {
      'resume-upload': '📄',
      'job-application': '💼',
      'assessment-completed': '🎯',
      'profile-update': '👤',
      'contact-added': '👥',
      'badge-earned': '🏆',
      'document-upload': '📎',
      'linkedin-post': '🔗',
      'other': '📝'
    };
    return icons[type] || icons.other;
  };

  const getActivityColor = (type) => {
    const colors = {
      'resume-upload': 'bg-blue-100 text-blue-700',
      'job-application': 'bg-green-100 text-green-700',
      'assessment-completed': 'bg-purple-100 text-purple-700',
      'profile-update': 'bg-yellow-100 text-yellow-700',
      'contact-added': 'bg-pink-100 text-pink-700',
      'badge-earned': 'bg-orange-100 text-orange-700',
      'document-upload': 'bg-indigo-100 text-indigo-700',
      'linkedin-post': 'bg-cyan-100 text-cyan-700',
      'other': 'bg-gray-100 text-gray-700'
    };
    return colors[type] || colors.other;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  // Group activities by date
  const groupedActivities = activities.reduce((acc, activity) => {
    const date = new Date(activity.timestamp).toLocaleDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(activity);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading activity timeline...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Activity Timeline</h2>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Activities</option>
          <option value="resume-upload">Resume Upload</option>
          <option value="job-application">Job Application</option>
          <option value="assessment-completed">Assessment</option>
          <option value="profile-update">Profile Update</option>
          <option value="contact-added">Contact Added</option>
          <option value="badge-earned">Badge Earned</option>
          <option value="document-upload">Document Upload</option>
          <option value="linkedin-post">LinkedIn Post</option>
        </select>
      </div>

      {activities.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No activities yet. Start using the platform to see your activity timeline!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, dateActivities]) => (
            <div key={date} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">{date}</h3>
              <div className="space-y-4">
                {dateActivities.map((activity) => (
                  <div key={activity._id} className="flex items-start space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl ${getActivityColor(activity.activityType)}`}>
                      {getActivityIcon(activity.activityType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-gray-800">{activity.activityName}</span>
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${getActivityColor(activity.activityType)}`}>
                          {activity.activityType.replace(/-/g, ' ')}
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-gray-600 mb-1">{activity.description}</p>
                      )}
                      <p className="text-xs text-gray-400">{formatTime(activity.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityTimeline;
