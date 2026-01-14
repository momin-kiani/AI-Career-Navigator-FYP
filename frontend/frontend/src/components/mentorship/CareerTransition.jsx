// components/mentorship/CareerTransition.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function CareerTransition() {
  const [transition, setTransition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentRole: '',
    targetRole: '',
    transitionType: 'role-change'
  });

  useEffect(() => {
    fetchTransition();
  }, []);

  const fetchTransition = async () => {
    try {
      const response = await axios.get('/mentorship/transition');
      setTransition(response.data);
      setFormData({
        currentRole: response.data.currentRole || '',
        targetRole: response.data.targetRole || '',
        transitionType: response.data.transitionType || 'role-change'
      });
    } catch (error) {
      // No transition plan exists yet
      console.log('No transition plan found');
    }
  };

  const generateGuidance = async (e) => {
    e.preventDefault();
    if (!formData.currentRole || !formData.targetRole) {
      alert('Please fill in both current and target roles');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('/mentorship/transition-guidance', {
        params: formData
      });
      setTransition(response.data);
    } catch (error) {
      alert('Failed to generate guidance: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const markStepComplete = (stepNumber) => {
    if (!transition) return;
    
    const updatedSteps = transition.guidance.steps.map(step =>
      step.stepNumber === stepNumber
        ? { ...step, completed: !step.completed }
        : step
    );
    
    setTransition({
      ...transition,
      guidance: {
        ...transition.guidance,
        steps: updatedSteps
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Transition Guidance</h2>
        <p className="text-gray-600 mb-6">
          Get step-by-step guidance for transitioning to a new role or industry.
        </p>

        <form onSubmit={generateGuidance} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Role</label>
              <input
                type="text"
                required
                value={formData.currentRole}
                onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                placeholder="e.g., Software Developer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
              <input
                type="text"
                required
                value={formData.targetRole}
                onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
                placeholder="e.g., Senior Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Transition Type</label>
            <select
              value={formData.transitionType}
              onChange={(e) => setFormData({...formData, transitionType: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="role-change">Role Change</option>
              <option value="industry-change">Industry Change</option>
              <option value="career-pivot">Career Pivot</option>
              <option value="promotion">Promotion</option>
              <option value="entrepreneurship">Entrepreneurship</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Transition Plan'}
          </button>
        </form>
      </div>

      {transition && transition.guidance && (
        <div className="space-y-6">
          {/* Timeline */}
          {transition.guidance.timeline && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Timeline</h3>
              <p className="text-gray-600 mb-4">
                Estimated duration: <strong>{transition.guidance.timeline.estimatedMonths} months</strong>
              </p>
              <div className="space-y-3">
                {transition.guidance.timeline.milestones.map((milestone, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                      milestone.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-700'
                    }`}>
                      {milestone.completed ? '✓' : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{milestone.milestone}</p>
                      <p className="text-sm text-gray-500">
                        Target: {new Date(milestone.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          {transition.guidance.steps && transition.guidance.steps.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Transition Steps</h3>
              <div className="space-y-4">
                {transition.guidance.steps.map((step) => (
                  <div key={step.stepNumber} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-800">Step {step.stepNumber}: {step.title}</h4>
                        <p className="text-gray-600 mt-1">{step.description}</p>
                        <p className="text-sm text-gray-500 mt-1">Estimated time: {step.estimatedTime}</p>
                      </div>
                      <button
                        onClick={() => markStepComplete(step.stepNumber)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                          step.completed
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {step.completed ? 'Completed' : 'Mark Complete'}
                      </button>
                    </div>
                    {step.resources && step.resources.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-semibold text-gray-700">Resources:</p>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {step.resources.map((resource, i) => (
                            <li key={i}>{resource}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skill Gaps */}
          {transition.guidance.skillGaps && transition.guidance.skillGaps.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Skill Gaps</h3>
              <div className="space-y-3">
                {transition.guidance.skillGaps.map((gap, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">{gap.skill}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        gap.priority === 'high' ? 'bg-red-100 text-red-700' :
                        gap.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {gap.priority} priority
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>Current: {gap.currentLevel}%</span>
                      <span>→</span>
                      <span>Target: {gap.requiredLevel}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {transition.guidance.recommendations && transition.guidance.recommendations.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {transition.guidance.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start text-blue-700">
                    <span className="mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CareerTransition;
