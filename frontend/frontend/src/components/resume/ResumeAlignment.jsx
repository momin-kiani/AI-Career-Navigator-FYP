// components/resume/ResumeAlignment.jsx
import React, { useState } from 'react';
import axios from '../../services/api';

function ResumeAlignment({ resumes, selectedResume, onSelectResume }) {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [alignment, setAlignment] = useState(null);

  const handleAlign = async (e) => {
    e.preventDefault();
    if (!selectedResume) {
      alert('Please select a resume first');
      return;
    }
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      alert('Please enter a job description (at least 50 characters)');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/resume/align-job', {
        resumeId: selectedResume._id,
        jobDescription,
        jobTitle,
        company
      });
      setAlignment(response.data.alignment);
    } catch (error) {
      alert('Alignment failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resume Selection */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Resume</h2>
        {resumes.length === 0 ? (
          <p className="text-gray-500">No resumes available. Please upload a resume first.</p>
        ) : (
          <div className="space-y-2">
            {resumes.map((resume) => (
              <button
                key={resume._id}
                onClick={() => onSelectResume(resume)}
                className={`w-full text-left p-4 border-2 rounded-lg transition ${
                  selectedResume?._id === resume._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="font-semibold text-gray-800">{resume.fileName || 'Resume'}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Job Description Form */}
      {selectedResume && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Enter Job Description</h2>
          <form onSubmit={handleAlign}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g., Tech Corp"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows="8"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Analyzing...' : 'Analyze Alignment'}
            </button>
          </form>
        </div>
      )}

      {/* Alignment Results */}
      {alignment && (
        <div className="space-y-6">
          {/* Alignment Score */}
          <div className={`bg-gradient-to-br rounded-xl shadow-md p-6 text-white ${
            alignment.alignmentScore >= 80 ? 'from-green-500 to-green-600' :
            alignment.alignmentScore >= 60 ? 'from-blue-500 to-blue-600' :
            alignment.alignmentScore >= 40 ? 'from-yellow-500 to-yellow-600' :
            'from-red-500 to-red-600'
          }`}>
            <h2 className="text-2xl font-bold mb-2">Alignment Score</h2>
            <div className="text-5xl font-bold mb-2">{alignment.alignmentScore}%</div>
            <div className="text-lg">{alignment.grade}</div>
          </div>

          {/* Matched Keywords */}
          {alignment.matchedKeywords && alignment.matchedKeywords.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Matched Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {alignment.matchedKeywords.map((keyword, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {alignment.missingKeywords && alignment.missingKeywords.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Missing Keywords</h3>
              <p className="text-sm text-gray-600 mb-3">
                Consider adding these keywords to improve your match score:
              </p>
              <div className="flex flex-wrap gap-2">
                {alignment.missingKeywords.map((keyword, index) => (
                  <span key={index} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Skills Analysis */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Skills Analysis</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-green-700 mb-2">Found Skills</h4>
                <div className="space-y-1">
                  {alignment.foundSkills && alignment.foundSkills.length > 0 ? (
                    alignment.foundSkills.map((skill, index) => (
                      <div key={index} className="text-sm text-gray-700">✓ {skill}</div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No skills matched</p>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-red-700 mb-2">Missing Skills</h4>
                <div className="space-y-1">
                  {alignment.missingSkills && alignment.missingSkills.length > 0 ? (
                    alignment.missingSkills.map((skill, index) => (
                      <div key={index} className="text-sm text-gray-700">✗ {skill}</div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">All skills matched!</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Suggestions */}
          {alignment.suggestions && alignment.suggestions.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Optimization Suggestions</h3>
              <ul className="space-y-2">
                {alignment.suggestions.map((suggestion, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    <span className="text-gray-700">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Algorithm Explanation */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-2">How Alignment Works</h3>
            <p className="text-sm text-blue-700">
              The alignment algorithm extracts keywords from the job description and compares them with your resume. 
              It calculates a match percentage based on keyword overlap, identifies missing skills, and provides 
              actionable suggestions to improve your resume's alignment with the job requirements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeAlignment;
