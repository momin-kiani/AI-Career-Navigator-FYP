// components/mentorship/GrowthRoadmap.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function GrowthRoadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    goal: '',
    timeframe: '1-year'
  });

  useEffect(() => {
    fetchRoadmap();
  }, []);

  const fetchRoadmap = async () => {
    try {
      const response = await axios.get('/mentorship/growth-roadmap');
      setRoadmap(response.data);
      setFormData({
        title: response.data.title || '',
        goal: response.data.goal || '',
        timeframe: response.data.timeframe || '1-year'
      });
    } catch (error) {
      // No roadmap exists yet
      console.log('No roadmap found');
    }
  };

  const generateRoadmap = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.goal) {
      alert('Please fill in title and goal');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/mentorship/growth-roadmap', formData);
      setRoadmap(response.data);
    } catch (error) {
      alert('Failed to generate roadmap: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const updateMilestone = async (milestoneId, status, progress) => {
    try {
      const response = await axios.put(`/mentorship/growth-roadmap/milestone/${milestoneId}`, {
        status,
        progress
      });
      setRoadmap(response.data);
    } catch (error) {
      alert('Failed to update milestone');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'not-started': 'bg-gray-100 text-gray-700',
      'blocked': 'bg-red-100 text-red-700'
    };
    return colors[status] || colors['not-started'];
  };

  return (
    <div className="space-y-6">
      {!roadmap && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Growth Roadmap</h2>
          <p className="text-gray-600 mb-6">
            Generate a personalized growth roadmap to guide your career development.
          </p>

          <form onSubmit={generateRoadmap} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Roadmap Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="e.g., Career Growth Plan 2024"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Goal</label>
              <textarea
                required
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                rows="3"
                placeholder="Describe your career growth goal..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
              <select
                value={formData.timeframe}
                onChange={(e) => setFormData({...formData, timeframe: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="3-months">3 Months</option>
                <option value="6-months">6 Months</option>
                <option value="1-year">1 Year</option>
                <option value="2-years">2 Years</option>
                <option value="5-years">5 Years</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Roadmap'}
            </button>
          </form>
        </div>
      )}

      {roadmap && (
        <div className="space-y-6">
          {/* Roadmap Header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{roadmap.title}</h2>
            <p className="text-lg opacity-90">{roadmap.goal}</p>
            <p className="text-sm opacity-75 mt-2">Timeframe: {roadmap.timeframe.replace('-', ' ')}</p>
          </div>

          {/* Milestones */}
          {roadmap.milestones && roadmap.milestones.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Milestones</h3>
              <div className="space-y-6">
                {roadmap.milestones.map((milestone, index) => (
                  <div key={milestone.milestoneId} className="border-l-4 border-blue-500 pl-6 relative">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-500 rounded-full border-4 border-white"></div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-gray-800 mb-1">{milestone.title}</h4>
                          <p className="text-gray-600 mb-2">{milestone.description}</p>
                          <p className="text-sm text-gray-500">
                            Target: {new Date(milestone.targetDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(milestone.status)}`}>
                            {milestone.status.replace('-', ' ')}
                          </span>
                          <span className="text-sm text-gray-600">{milestone.progress}%</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all"
                          style={{ width: `${milestone.progress}%` }}
                        />
                      </div>

                      {/* Tasks */}
                      {milestone.tasks && milestone.tasks.length > 0 && (
                        <div className="mb-4">
                          <h5 className="font-semibold text-gray-700 mb-2">Tasks:</h5>
                          <ul className="space-y-1">
                            {milestone.tasks.map((task) => (
                              <li key={task.taskId} className="flex items-center text-sm text-gray-600">
                                <input
                                  type="checkbox"
                                  checked={task.completed}
                                  onChange={() => {
                                    const updatedTasks = milestone.tasks.map(t =>
                                      t.taskId === task.taskId ? {...t, completed: !t.completed} : t
                                    );
                                    const updatedMilestone = {...milestone, tasks: updatedTasks};
                                    const updatedMilestones = roadmap.milestones.map(m =>
                                      m.milestoneId === milestone.milestoneId ? updatedMilestone : m
                                    );
                                    setRoadmap({...roadmap, milestones: updatedMilestones});
                                  }}
                                  className="mr-2"
                                />
                                <span className={task.completed ? 'line-through text-gray-400' : ''}>
                                  {task.title}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Mentor Feedback */}
                      {milestone.mentorFeedback && milestone.mentorFeedback.length > 0 && (
                        <div className="bg-blue-50 rounded-lg p-3 mb-3">
                          <h5 className="font-semibold text-blue-800 mb-2">Mentor Feedback:</h5>
                          {milestone.mentorFeedback.map((feedback, i) => (
                            <p key={i} className="text-sm text-blue-700">{feedback.feedback}</p>
                          ))}
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateMilestone(milestone.milestoneId, 'in-progress', milestone.progress)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          Start
                        </button>
                        <button
                          onClick={() => updateMilestone(milestone.milestoneId, 'completed', 100)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                        >
                          Complete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills to Develop */}
          {roadmap.skillsToDevelop && roadmap.skillsToDevelop.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Skills to Develop</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roadmap.skillsToDevelop.map((skill, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">{skill.skill}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        skill.priority === 'high' ? 'bg-red-100 text-red-700' :
                        skill.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {skill.priority}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm mb-2">
                      <span>Current: {skill.currentLevel}%</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${skill.currentLevel}%` }}
                        />
                      </div>
                      <span>Target: {skill.targetLevel}%</span>
                    </div>
                    {skill.learningResources && skill.learningResources.length > 0 && (
                      <div className="text-xs text-gray-600">
                        Resources: {skill.learningResources.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default GrowthRoadmap;
