// components/assistant/ResumeFeedback.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function ResumeFeedback() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/resume/list');
      const resumesData = response.data || [];
      setResumes(resumesData);
      if (resumesData.length > 0) {
        setSelectedResume(resumesData[0]._id);
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to load resumes';
      alert(`Error: ${errorMsg}`);
    }
  };

  const getFeedback = async () => {
    if (!selectedResume) {
      alert('Please select a resume first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/assistant/resume-feedback', {
        resumeId: selectedResume
      });
      if (response.data) {
        setFeedback(response.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Error getting feedback:', error);
      const errorMsg = error.response?.data?.error || error.message || 'Failed to get feedback';
      alert(`Error: ${errorMsg}\n\nPlease ensure you have uploaded a resume first.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Real-Time Resume Feedback</h2>
        <p className="text-gray-600 mb-6">
          Get AI-powered feedback on your resume with actionable suggestions for improvement.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Resume</label>
            <select
              value={selectedResume || ''}
              onChange={(e) => setSelectedResume(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a resume</option>
              {resumes.map((resume) => (
                <option key={resume._id} value={resume._id}>
                  {resume.fileName || 'Resume'} {resume.atsScore ? `(ATS: ${resume.atsScore}%)` : ''}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={getFeedback}
            disabled={loading || !selectedResume}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Get AI Feedback'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className="space-y-6">
          {/* Overall Score */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">{feedback.overallScore}%</div>
              <div className="text-xl">Overall Resume Score</div>
            </div>
          </div>

          {/* Strengths */}
          {feedback.strengths && feedback.strengths.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">✅ Strengths</h3>
              <ul className="space-y-2">
                {feedback.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {feedback.weaknesses && feedback.weaknesses.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">⚠️ Areas for Improvement</h3>
              <ul className="space-y-2">
                {feedback.weaknesses.map((weakness, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">•</span>
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Suggestions */}
          {feedback.suggestions && feedback.suggestions.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Suggestions</h3>
              <div className="space-y-3">
                {feedback.suggestions.map((suggestion, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-gray-800">{suggestion.suggestion}</span>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                        suggestion.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {suggestion.priority} priority
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Category: {suggestion.category}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Keyword Analysis */}
          {feedback.keywordAnalysis && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">🔍 Keyword Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-green-700 mb-2">Found Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {feedback.keywordAnalysis.found.map((keyword, index) => (
                      <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Missing Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {feedback.keywordAnalysis.missing.map((keyword, index) => (
                      <span key={index} className="bg-red-100 text-red-700 px-3 py-1 rounded text-sm">
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Improvements */}
          {feedback.improvements && feedback.improvements.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Quick Improvements</h3>
              <ul className="space-y-2">
                {feedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">→</span>
                    <span className="text-gray-700">{improvement}</span>
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

export default ResumeFeedback;
