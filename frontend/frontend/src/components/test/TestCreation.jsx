// components/test/TestCreation.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function TestCreation({ onBack, onTestCreated }) {
  const [fields, setFields] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    field: '',
    useAI: true,
    aiConfig: {
      topic: '',
      difficulty: 'medium',
      count: 10
    },
    duration: '',
    passingScore: 60,
    difficulty: 'intermediate',
    instructions: ''
  });
  const [manualQuestions, setManualQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFields();
  }, []);

  const fetchFields = async () => {
    try {
      const response = await axios.get('/test/fields');
      setFields(response.data.fields);
    } catch (error) {
      console.error('Error fetching fields:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...formData,
        questions: formData.useAI ? null : manualQuestions,
        duration: formData.duration ? parseInt(formData.duration) : null
      };

      await axios.post('/test/create', payload);
      alert('Test created successfully!');
      onTestCreated();
    } catch (error) {
      alert('Failed to create test: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const addManualQuestion = () => {
    setManualQuestions([...manualQuestions, {
      questionText: '',
      questionType: 'multiple-choice',
      options: [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ],
      correctAnswer: '',
      explanation: '',
      marks: 1,
      difficulty: 'medium'
    }]);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Test</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Test Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field *</label>
            <select
              value={formData.field}
              onChange={(e) => setFormData({...formData, field: e.target.value})}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Field</option>
              {fields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="useAI"
            checked={formData.useAI}
            onChange={(e) => setFormData({...formData, useAI: e.target.checked})}
            className="w-4 h-4"
          />
          <label htmlFor="useAI" className="text-sm font-medium text-gray-700">
            Use AI to generate questions
          </label>
        </div>

        {formData.useAI ? (
          <div className="bg-blue-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-blue-800">AI Question Generation</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
                <input
                  type="text"
                  value={formData.aiConfig.topic}
                  onChange={(e) => setFormData({
                    ...formData,
                    aiConfig: {...formData.aiConfig, topic: e.target.value}
                  })}
                  placeholder={formData.field || 'e.g., React'}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                <select
                  value={formData.aiConfig.difficulty}
                  onChange={(e) => setFormData({
                    ...formData,
                    aiConfig: {...formData.aiConfig, difficulty: e.target.value}
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question Count</label>
                <input
                  type="number"
                  value={formData.aiConfig.count}
                  onChange={(e) => setFormData({
                    ...formData,
                    aiConfig: {...formData.aiConfig, count: parseInt(e.target.value)}
                  })}
                  min="1"
                  max="50"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-800">Manual Questions</h3>
              <button
                type="button"
                onClick={addManualQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Add Question
              </button>
            </div>
            <p className="text-sm text-gray-600">Manual question creation coming soon...</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
            <input
              type="number"
              value={formData.duration}
              onChange={(e) => setFormData({...formData, duration: e.target.value})}
              placeholder="Optional"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Passing Score (%)</label>
            <input
              type="number"
              value={formData.passingScore}
              onChange={(e) => setFormData({...formData, passingScore: parseInt(e.target.value)})}
              min="0"
              max="100"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Instructions</label>
          <textarea
            value={formData.instructions}
            onChange={(e) => setFormData({...formData, instructions: e.target.value})}
            rows={3}
            placeholder="Test instructions for students..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Test'}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default TestCreation;
