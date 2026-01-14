// components/assistant/SmartAlerts.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function SmartAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/assistant/alerts');
      const alertsData = response.data || [];
      setAlerts(Array.isArray(alertsData) ? alertsData : []);
    } catch (error) {
      console.error('Error fetching alerts:', error);
      setAlerts([]);
      // Don't show error to user - empty state is handled in UI
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId) => {
    try {
      await axios.post(`/assistant/alerts/${alertId}/read`);
      fetchAlerts();
    } catch (error) {
      console.error('Error marking alert as read:', error);
      alert('Failed to mark alert as read. Please try again.');
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      await axios.post(`/assistant/alerts/${alertId}/dismiss`);
      fetchAlerts();
    } catch (error) {
      console.error('Error dismissing alert:', error);
      alert('Failed to dismiss alert. Please try again.');
    }
  };

  const getAlertIcon = (type) => {
    const icons = {
      'job-match': '💼',
      'deadline-approaching': '⏰',
      'market-change': '📊',
      'skill-demand': '📚',
      'opportunity': '🎯',
      'reminder': '🔔'
    };
    return icons[type] || '📢';
  };

  const getAlertColor = (priority) => {
    const colors = {
      urgent: 'bg-red-100 border-red-300',
      high: 'bg-orange-100 border-orange-300',
      medium: 'bg-yellow-100 border-yellow-300',
      low: 'bg-blue-100 border-blue-300'
    };
    return colors[priority] || colors.medium;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading alerts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Smart Alerts</h2>
        <button
          onClick={fetchAlerts}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🔔</div>
          <p className="text-gray-500 text-lg">No alerts at the moment</p>
          <p className="text-gray-400 mt-2">You'll be notified about important updates, deadlines, and opportunities!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert._id}
              className={`bg-white rounded-xl shadow-md p-6 border-l-4 ${getAlertColor(alert.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <span className="text-4xl">{getAlertIcon(alert.alertType)}</span>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{alert.title}</h3>
                      {!alert.isRead && (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                          New
                        </span>
                      )}
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        alert.priority === 'urgent' ? 'bg-red-200 text-red-800' :
                        alert.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                        alert.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {alert.priority}
                      </span>
                    </div>
                    {alert.message && (
                      <p className="text-gray-700 mb-3">{alert.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!alert.isRead && (
                    <button
                      onClick={() => markAsRead(alert._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => dismissAlert(alert._id)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-300 transition"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SmartAlerts;
