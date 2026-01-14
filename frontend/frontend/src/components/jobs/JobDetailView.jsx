// components/jobs/JobDetailView.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function JobDetailView({ job, onBack, onUpdate }) {
  const [skillMatch, setSkillMatch] = useState(null);
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (job.jobDescription && !job.skillMatch) {
      analyzeJob();
    }
    if (job.jobDescription && !summary) {
      summarizeJob();
    }
  }, [job]);

  const analyzeJob = async () => {
    if (!job.jobDescription) return;
    
    setLoading(true);
    try {
      // Get user's latest resume
      const resumesResponse = await axios.get('/resume/list');
      const resumes = resumesResponse.data;
      
      if (resumes.length > 0) {
        const response = await axios.post('/jobs/match-skills', {
          jobDescription: job.jobDescription,
          resumeId: resumes[0]._id
        });
        setSkillMatch(response.data);
      }
    } catch (error) {
      console.error('Error analyzing job:', error);
    } finally {
      setLoading(false);
    }
  };

  const summarizeJob = async () => {
    if (!job.jobDescription) return;
    
    try {
      const response = await axios.post('/jobs/summarize', {
        jobDescription: job.jobDescription
      });
      setSummary(response.data);
    } catch (error) {
      console.error('Error summarizing job:', error);
    }
  };

  const statusColors = {
    saved: 'bg-gray-100 text-gray-700',
    applied: 'bg-blue-100 text-blue-700',
    interviewing: 'bg-yellow-100 text-yellow-700',
    offered: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    accepted: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className="p-8">
      <button
        onClick={onBack}
        className="mb-6 text-blue-600 hover:text-blue-700 font-semibold"
      >
        ← Back to Applications
      </button>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.jobTitle}</h1>
            <p className="text-xl text-gray-600 mb-2">{job.company}</p>
            {job.location && <p className="text-gray-500">📍 {job.location}</p>}
          </div>
          <div className="text-right">
            <span className={`px-4 py-2 rounded-lg font-semibold ${statusColors[job.status]}`}>
              {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
            </span>
          </div>
        </div>

        {job.jobUrl && (
          <a
            href={job.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700 font-semibold"
          >
            View Original Posting →
          </a>
        )}
      </div>

      {/* Skill Match */}
      {(skillMatch || job.skillMatch) && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Skill Match Analysis</h2>
          <div className={`bg-gradient-to-br rounded-xl p-6 text-white mb-4 ${
            (skillMatch || job.skillMatch).matchScore >= 80 ? 'from-green-500 to-green-600' :
            (skillMatch || job.skillMatch).matchScore >= 60 ? 'from-blue-500 to-blue-600' :
            (skillMatch || job.skillMatch).matchScore >= 40 ? 'from-yellow-500 to-yellow-600' :
            'from-red-500 to-red-600'
          }`}>
            <div className="text-5xl font-bold mb-2">{(skillMatch || job.skillMatch).matchScore || job.skillMatch?.score}%</div>
            <div className="text-lg">{(skillMatch || job.skillMatch).grade || 'Match Score'}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-green-700 mb-2">Matched Skills</h3>
              <div className="flex flex-wrap gap-2">
                {((skillMatch || job.skillMatch).matchedSkills || job.skillMatch?.matchedSkills || []).map((skill, i) => (
                  <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-red-700 mb-2">Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {((skillMatch || job.skillMatch).missingSkills || job.skillMatch?.missingSkills || []).map((skill, i) => (
                  <span key={i} className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Summary */}
      {summary && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">AI-Generated Summary</h2>
          <p className="text-gray-700 mb-4">{summary.summaryText}</p>
          
          {summary.keySkills && summary.keySkills.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Key Skills</h3>
              <div className="flex flex-wrap gap-2">
                {summary.keySkills.map((skill, i) => (
                  <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {summary.responsibilities && summary.responsibilities.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Key Responsibilities</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {summary.responsibilities.map((resp, i) => (
                  <li key={i}>{resp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Job Description */}
      {job.jobDescription && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Full Job Description</h2>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap">{job.jobDescription}</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Analyzing job...</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobDetailView;
