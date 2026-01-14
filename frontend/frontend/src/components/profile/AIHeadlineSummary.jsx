// components/profile/AIHeadlineSummary.jsx
import React, { useState } from 'react';
import axios from '../../services/api';

function AIHeadlineSummary() {
  const [headline, setHeadline] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loadingHeadline, setLoadingHeadline] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const generateHeadline = async () => {
    setLoadingHeadline(true);
    try {
      const response = await axios.post('/profile/ai-headline');
      setHeadline(response.data);
    } catch (error) {
      alert('Failed to generate headline: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoadingHeadline(false);
    }
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    try {
      const response = await axios.post('/profile/ai-summary');
      setSummary(response.data);
    } catch (error) {
      alert('Failed to generate summary: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoadingSummary(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Headline Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI-Generated Headline</h2>
            <p className="text-gray-600 mt-1">Generate an optimized professional headline based on your profile</p>
          </div>
          <button
            onClick={generateHeadline}
            disabled={loadingHeadline}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loadingHeadline ? 'Generating...' : 'Generate Headline'}
          </button>
        </div>

        {headline && (
          <div className="mt-6 space-y-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border-2 border-blue-200">
              <div className="flex justify-between items-start mb-2">
                <p className="text-lg font-semibold text-gray-800">{headline.headline}</p>
                <button
                  onClick={() => copyToClipboard(headline.headline)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-600">Length: {headline.length} characters</p>
            </div>

            {headline.suggestions && headline.suggestions.length > 0 && (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">Tips</h4>
                <ul className="space-y-1">
                  {headline.suggestions.map((tip, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI-Generated Summary</h2>
            <p className="text-gray-600 mt-1">Generate a compelling professional summary based on your profile</p>
          </div>
          <button
            onClick={generateSummary}
            disabled={loadingSummary}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loadingSummary ? 'Generating...' : 'Generate Summary'}
          </button>
        </div>

        {summary && (
          <div className="mt-6 space-y-4">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border-2 border-purple-200">
              <div className="flex justify-between items-start mb-2">
                <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{summary.summary}</p>
                <button
                  onClick={() => copyToClipboard(summary.summary)}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition ml-4"
                >
                  Copy
                </button>
              </div>
              <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                <span>Word Count: {summary.wordCount}</span>
                <span>Estimated Read Time: {Math.ceil(summary.wordCount / 200)} min</span>
              </div>
            </div>

            {summary.suggestions && summary.suggestions.length > 0 && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-semibold text-purple-800 mb-2">Tips</h4>
                <ul className="space-y-1">
                  {summary.suggestions.map((tip, index) => (
                    <li key={index} className="text-sm text-purple-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Algorithm Explanation */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">How AI Generation Works</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Headline Generation</h4>
            <p className="text-sm text-gray-600">
              The AI extracts your current role and key skills from your resume, then uses proven headline templates 
              to create an optimized headline. It ensures the headline is within LinkedIn's 120-character limit and 
              includes relevant keywords for better discoverability.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Summary Generation</h4>
            <p className="text-sm text-gray-600">
              The AI analyzes your profile data (name, role, location, experience, skills) and structures a professional 
              summary using first-person narrative. It includes your expertise, value proposition, and a networking call-to-action, 
              keeping the content between 200-300 words for optimal engagement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AIHeadlineSummary;
