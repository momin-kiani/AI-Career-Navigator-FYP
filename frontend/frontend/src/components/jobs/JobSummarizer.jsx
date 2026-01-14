// components/jobs/JobSummarizer.jsx
import React, { useState } from 'react';
import axios from '../../services/api';

function JobSummarizer() {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleSummarize = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      alert('Please enter a job description (at least 50 characters)');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/jobs/summarize', {
        jobDescription
      });
      setSummary(response.data);
    } catch (error) {
      alert('Summarization failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Description Summarizer</h2>
        <p className="text-gray-600 mb-6">
          Paste a job description and get an AI-generated summary with key skills, responsibilities, and requirements.
        </p>

        <form onSubmit={handleSummarize} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="12"
              placeholder="Paste the full job description here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Minimum 50 characters required</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Summarizing...' : 'Generate Summary'}
          </button>
        </form>
      </div>

      {summary && (
        <div className="space-y-6">
          {/* Summary Text */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Summary</h3>
            <p className="text-gray-700 leading-relaxed">{summary.summaryText}</p>
          </div>

          {/* Key Skills */}
          {summary.keySkills && summary.keySkills.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {summary.keySkills.map((skill, index) => (
                  <span key={index} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities */}
          {summary.responsibilities && summary.responsibilities.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Key Responsibilities</h3>
              <ul className="space-y-2">
                {summary.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {summary.requirements && summary.requirements.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Requirements</h3>
              <ul className="space-y-2">
                {summary.requirements.map((req, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">✓</span>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Algorithm Explanation */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-2">How Summarization Works</h3>
            <p className="text-sm text-purple-700">
              The AI uses pattern matching to extract information from job descriptions. It identifies:
            </p>
            <ul className="list-disc list-inside text-sm text-purple-700 mt-2 space-y-1">
              <li>Key skills from "Required Skills" or "Must Have" sections</li>
              <li>Responsibilities from bullet points and structured sections</li>
              <li>Requirements from "Requirements" or "Qualifications" sections</li>
              <li>Generates a concise summary highlighting experience level and focus areas</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobSummarizer;
