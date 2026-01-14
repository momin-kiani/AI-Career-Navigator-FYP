// components/network/ElevatorPitch.jsx
import React, { useState } from 'react';
import axios from '../../services/api';

function ElevatorPitch() {
  const [context, setContext] = useState('networking');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [pitch, setPitch] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/ai/elevator-pitch', {
        context,
        targetRole: targetRole || null
      });
      setPitch(response.data);
    } catch (error) {
      alert('Failed to generate pitch: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Elevator Pitch Generator</h2>
        <p className="text-gray-600 mb-6">
          Generate a personalized 30-60 second elevator pitch based on your profile and the context of your conversation.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
            <select
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="networking">Networking Event</option>
              <option value="interview">Job Interview</option>
              <option value="job-fair">Job Fair</option>
              <option value="elevator">Elevator (Quick Introduction)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Role/Industry (Optional)</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Software Engineer, Marketing Manager"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Pitch'}
          </button>
        </form>
      </div>

      {pitch && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-xl font-bold mb-4">Your Elevator Pitch</h3>
            <p className="text-lg leading-relaxed mb-4">{pitch.pitch}</p>
            <div className="flex items-center space-x-4 text-purple-100">
              <div>
                <span className="text-sm">Word Count:</span>
                <span className="font-bold ml-2">{pitch.wordCount}</span>
              </div>
              <div>
                <span className="text-sm">Estimated Duration:</span>
                <span className="font-bold ml-2">{pitch.estimatedDuration} seconds</span>
              </div>
            </div>
          </div>

          {pitch.tips && pitch.tips.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Tips for Delivery</h4>
              <ul className="space-y-2">
                {pitch.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-purple-500 mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-blue-50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-blue-800 mb-2">How It Works</h4>
            <p className="text-sm text-blue-700">
              The AI analyzes your profile (skills, experience, goals) and generates a personalized pitch using proven frameworks. 
              The pitch is structured with an opening, value proposition, and call-to-action, tailored to your selected context. 
              The algorithm extracts key information from your resume and user profile to create a natural, compelling introduction.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ElevatorPitch;
