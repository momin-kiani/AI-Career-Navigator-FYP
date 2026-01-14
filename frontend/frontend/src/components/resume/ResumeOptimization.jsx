// components/resume/ResumeOptimization.jsx
import React, { useState } from 'react';
import axios from '../../services/api';

function ResumeOptimization({ resumes, selectedResume, onSelectResume, onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [optimization, setOptimization] = useState(null);

  const handleOptimize = async () => {
    if (!selectedResume) {
      alert('Please select a resume first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/resume/optimize', {
        resumeId: selectedResume._id
      });
      setOptimization(response.data);
    } catch (error) {
      alert('Optimization failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Resume Selection */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Select Resume to Optimize</h2>
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
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{resume.fileName || 'Resume'}</span>
                  <span className="text-sm text-gray-600">ATS: {resume.atsScore}%</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedResume && (
        <>
          <div className="bg-white rounded-xl shadow-md p-6">
            <button
              onClick={handleOptimize}
              disabled={loading}
              className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            >
              {loading ? 'Optimizing...' : 'Generate Optimized Content'}
            </button>
          </div>

          {optimization && (
            <div className="space-y-6">
              {/* Score Comparison */}
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
                <h2 className="text-2xl font-bold mb-4">Optimization Results</h2>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-purple-200">Original Score</div>
                    <div className="text-3xl font-bold">{optimization.originalScore}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-200">Optimized Score</div>
                    <div className="text-3xl font-bold">{optimization.optimizedScore}%</div>
                  </div>
                  <div>
                    <div className="text-sm text-purple-200">Improvement</div>
                    <div className="text-3xl font-bold">+{optimization.improvement}%</div>
                  </div>
                </div>
              </div>

              {/* Generated Summary */}
              {optimization.summary && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">AI-Generated Professional Summary</h3>
                  <p className="text-gray-700 leading-relaxed">{optimization.summary}</p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>How it works:</strong> The AI analyzes your resume content to identify key skills, 
                      experience level, and professional focus, then generates a concise summary that highlights 
                      your strengths in an ATS-friendly format.
                    </p>
                  </div>
                </div>
              )}

              {/* Optimized Bullet Points */}
              {optimization.bulletPoints && optimization.bulletPoints.length > 0 && (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Optimized Bullet Points</h3>
                  <div className="space-y-4">
                    {optimization.bulletPoints.map((bp, index) => (
                      <div key={index} className="border-l-4 border-purple-500 pl-4">
                        {bp.original && (
                          <div className="mb-2">
                            <div className="text-sm font-semibold text-gray-600">Original:</div>
                            <div className="text-gray-700">{bp.original}</div>
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-semibold text-purple-600">Optimized:</div>
                          <div className="text-gray-800 font-medium">{bp.optimized}</div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                            {bp.improvement}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      <strong>Optimization Logic:</strong> Bullet points are enhanced by adding action verbs 
                      (Led, Managed, Developed, etc.), incorporating quantifiable metrics where possible, 
                      and ensuring keyword alignment with ATS requirements.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ResumeOptimization;
