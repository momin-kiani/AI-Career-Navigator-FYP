// pages/ResumeModule.jsx
import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import ResumeOptimization from '../components/resume/ResumeOptimization';
import ResumeAlignment from '../components/resume/ResumeAlignment';
import ResumeTemplates from '../components/resume/ResumeTemplates';
import CoverLetterGenerator from '../components/resume/CoverLetterGenerator';
import ATSScoreCard from '../components/resume/ATSScoreCard';

function ResumeModule() {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [resumeContent, setResumeContent] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const [activeTab, setActiveTab] = useState('upload'); // upload, optimize, align, templates, cover-letter
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const response = await axios.get('/resume/list');
      setResumes(response.data);
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const handleTextUpload = async (e) => {
    e.preventDefault();
    if (!resumeContent.trim()) {
      alert('Please enter resume content');
      return;
    }
    setUploading(true);

    try {
      await axios.post('/resume/upload', {
        fileName: 'Resume.txt',
        content: resumeContent
      });
      
      setResumeContent('');
      fetchResumes();
      alert('Resume uploaded and analyzed successfully!');
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a file');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('resumeFile', file);

    try {
      await axios.post('/resume/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setFile(null);
      fetchResumes();
      alert('Resume uploaded and analyzed successfully!');
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Resume Optimization</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'upload'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Upload Resume
          </button>
          <button
            onClick={() => setActiveTab('optimize')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'optimize'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Optimize
          </button>
          <button
            onClick={() => setActiveTab('align')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'align'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Align with Job
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'templates'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('cover-letter')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'cover-letter'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Cover Letter
          </button>
        </div>
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-6">
          {/* Text Upload */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Resume (Text)</h2>
            <form onSubmit={handleTextUpload}>
              <textarea
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                required
              />
              <button
                type="submit"
                disabled={uploading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload & Analyze'}
              </button>
            </form>
          </div>

          {/* File Upload */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Upload Resume (PDF/DOCX)</h2>
            <form onSubmit={handleFileUpload}>
              <div className="mb-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p className="text-sm text-gray-500 mt-2">Supported formats: PDF, DOC, DOCX (Max 10MB)</p>
              </div>
              <button
                type="submit"
                disabled={uploading || !file}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload & Analyze'}
              </button>
            </form>
          </div>

          {/* Resume List */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Resumes</h2>
            <div className="space-y-4">
              {resumes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No resumes uploaded yet</p>
              ) : (
                resumes.map((resume) => (
                  <div
                    key={resume._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                    onClick={() => setSelectedResume(resume)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800">{resume.fileName || 'Resume'}</h3>
                        <p className="text-sm text-gray-500">
                          Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <ATSScoreCard score={resume.atsScore} breakdown={resume.analysis?.atsBreakdown} />
                      </div>
                    </div>
                    
                    {resume.analysis && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Strengths</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {resume.analysis.strengths?.slice(0, 3).map((strength, i) => (
                                <li key={i}>✓ {strength}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">Suggestions</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {resume.analysis.suggestions?.slice(0, 3).map((suggestion, i) => (
                                <li key={i}>• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Optimize Tab */}
      {activeTab === 'optimize' && (
        <ResumeOptimization
          resumes={resumes}
          selectedResume={selectedResume}
          onSelectResume={setSelectedResume}
          onRefresh={fetchResumes}
        />
      )}

      {/* Align Tab */}
      {activeTab === 'align' && (
        <ResumeAlignment
          resumes={resumes}
          selectedResume={selectedResume}
          onSelectResume={setSelectedResume}
        />
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && <ResumeTemplates />}

      {/* Cover Letter Tab */}
      {activeTab === 'cover-letter' && <CoverLetterGenerator />}
    </div>
  );
}

export default ResumeModule;
