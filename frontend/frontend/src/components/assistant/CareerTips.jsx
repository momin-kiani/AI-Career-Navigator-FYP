// components/assistant/CareerTips.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function CareerTips() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/assistant/career-tips');
      const tipsData = response.data || [];
      setTips(Array.isArray(tipsData) ? tipsData : []);
    } catch (error) {
      console.error('Error fetching tips:', error);
      setTips([]);
      // Don't show error to user - empty state is handled in UI
    } finally {
      setLoading(false);
    }
  };

  const markAsCompleted = async (tipId) => {
    try {
      await axios.post(`/assistant/career-tips/${tipId}/complete`);
      fetchTips();
      alert('Tip marked as completed!');
    } catch (error) {
      alert('Failed to mark tip as completed');
    }
  };

  const getTipIcon = (type) => {
    const icons = {
      'skill-development': '📚',
      'networking': '🌐',
      'interview-prep': '💼',
      'career-growth': '📈',
      'industry-trends': '📊',
      'learning-resource': '🎓'
    };
    return icons[type] || '💡';
  };

  const getTipColor = (type) => {
    const colors = {
      'skill-development': 'bg-blue-100 text-blue-700',
      'networking': 'bg-green-100 text-green-700',
      'interview-prep': 'bg-purple-100 text-purple-700',
      'career-growth': 'bg-yellow-100 text-yellow-700',
      'industry-trends': 'bg-pink-100 text-pink-700',
      'learning-resource': 'bg-indigo-100 text-indigo-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading career tips...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Growth Tips</h2>
        <p className="text-gray-600">
          Personalized recommendations to help you grow in your career journey.
        </p>
      </div>

      {tips.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No tips available yet. Check back soon for personalized recommendations!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tips.map((tip) => (
            <div key={tip._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl">{getTipIcon(tip.tipType)}</span>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{tip.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTipColor(tip.tipType)}`}>
                      {tip.tipType.replace(/-/g, ' ')}
                    </span>
                  </div>
                </div>
                {tip.priority === 'high' && (
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                    High Priority
                  </span>
                )}
              </div>

              {tip.description && (
                <p className="text-gray-600 mb-4">{tip.description}</p>
              )}

              {tip.content && (
                <p className="text-gray-700 mb-4">{tip.content}</p>
              )}

              {tip.actionItems && tip.actionItems.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Action Items:</h4>
                  <ul className="space-y-1">
                    {tip.actionItems.map((item, index) => (
                      <li key={index} className="flex items-start text-sm text-gray-600">
                        <span className="text-blue-500 mr-2">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {tip.resources && tip.resources.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Resources:</h4>
                  <ul className="space-y-1">
                    {tip.resources.map((resource, index) => (
                      <li key={index}>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {resource.title || resource}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => markAsCompleted(tip._id)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
              >
                Mark as Completed
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CareerTips;
