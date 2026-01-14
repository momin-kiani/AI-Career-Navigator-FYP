// components/jobs/AutofillApplication.jsx
import React, { useState } from 'react';
import axios from '../../services/api';

function AutofillApplication({ onApplicationCreated }) {
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [autofill, setAutofill] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAutofill = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim() || jobDescription.trim().length < 50) {
      alert('Please enter a job description (at least 50 characters)');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/jobs/autofill', {
        jobDescription,
        jobUrl
      });
      setAutofill(response.data);
    } catch (error) {
      alert('Autofill failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!autofill) return;

    setSaving(true);
    try {
      await axios.post('/jobs/applications', {
        jobTitle: autofill.jobTitle || 'Untitled Position',
        company: autofill.company || '',
        jobUrl: jobUrl || '',
        jobDescription: jobDescription,
        location: autofill.location || '',
        salary: autofill.salary,
        status: 'saved'
      });
      alert('Application saved successfully!');
      setJobDescription('');
      setJobUrl('');
      setAutofill(null);
      if (onApplicationCreated) onApplicationCreated();
    } catch (error) {
      alert('Failed to save application: ' + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Autofill Application</h2>
        <p className="text-gray-600 mb-6">
          Paste a job description and URL, and we'll automatically extract key information to pre-fill your application.
        </p>

        <form onSubmit={handleAutofill} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job URL (Optional)</label>
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows="10"
              placeholder="Paste the full job description here..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-1">Minimum 50 characters required</p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Extracting Information...' : 'Autofill Application'}
          </button>
        </form>
      </div>

      {autofill && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Extracted Information</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
              <input
                type="text"
                value={autofill.jobTitle || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                value={autofill.company || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                value={autofill.location || ''}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>
            {autofill.salary && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <input
                  type="text"
                  value={`${autofill.salary.currency || 'USD'} ${autofill.salary.min?.toLocaleString()} - ${autofill.salary.max?.toLocaleString()}`}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            )}
            {autofill.deadline && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Application Deadline</label>
                <input
                  type="text"
                  value={new Date(autofill.deadline).toLocaleDateString()}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save as Application'}
            </button>
            <button
              onClick={() => setAutofill(null)}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Clear
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>How it works:</strong> The autofill algorithm uses pattern matching to extract job title, 
              company name, location, salary, and deadline from the job description. It identifies common patterns 
              like "Position: Software Engineer", "Company: Tech Corp", and salary ranges to pre-populate the form.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutofillApplication;
