// components/resume/CoverLetterGenerator.jsx
import React, { useState } from 'react';
import axios from '../../services/api';

function CoverLetterGenerator() {
  const [formData, setFormData] = useState({
    jobTitle: '',
    companyName: '',
    jobDescription: '',
    hiringManagerName: '',
    tone: 'professional'
  });
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!formData.jobTitle || !formData.companyName) {
      alert('Please fill in job title and company name');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/cover-letter/generate', formData);
      setCoverLetter(response.data);
    } catch (error) {
      alert('Failed to generate cover letter: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter.coverLetter);
      alert('Cover letter copied to clipboard!');
    }
  };

  const downloadAsTxt = () => {
    if (coverLetter) {
      const element = document.createElement('a');
      const file = new Blob([coverLetter.coverLetter], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Cover_Letter_${formData.companyName.replace(/\s+/g, '_')}_${formData.jobTitle.replace(/\s+/g, '_')}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Cover Letter Generator</h2>
        <p className="text-gray-600 mb-6">
          Generate a professional cover letter tailored to your job application. The AI will analyze your profile, resume, and the job description to create a personalized cover letter.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Software Engineer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                required
                value={formData.companyName}
                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Tech Corp"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hiring Manager Name (Optional)
            </label>
            <input
              type="text"
              value={formData.hiringManagerName}
              onChange={(e) => setFormData({...formData, hiringManagerName: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., John Smith"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description (Optional but Recommended)
            </label>
            <textarea
              value={formData.jobDescription}
              onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Paste the job description here for better alignment..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Including the job description helps the AI match your skills and experience to the requirements.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tone
            </label>
            <select
              value={formData.tone}
              onChange={(e) => setFormData({...formData, tone: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="enthusiastic">Enthusiastic</option>
              <option value="formal">Formal</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Cover Letter'}
          </button>
        </form>
      </div>

      {coverLetter && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Generated Cover Letter</h3>
              <p className="text-sm text-gray-600 mt-1">
                {coverLetter.wordCount} words • {coverLetter.estimatedReadTime} min read • ATS Score: {coverLetter.atsScore}%
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Copy
              </button>
              <button
                onClick={downloadAsTxt}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition"
              >
                Download
              </button>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 mb-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
              {coverLetter.coverLetter}
            </pre>
          </div>

          {coverLetter.suggestions && coverLetter.suggestions.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">Suggestions:</h4>
              <ul className="space-y-1">
                {coverLetter.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {coverLetter.keywords && coverLetter.keywords.length > 0 && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Matched Keywords:</h4>
              <div className="flex flex-wrap gap-2">
                {coverLetter.keywords.map((keyword, index) => (
                  <span key={index} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CoverLetterGenerator;
