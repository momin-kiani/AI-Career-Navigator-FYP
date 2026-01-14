// pages/LinkedInModule.jsx
import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import ProfileChecklist from '../components/profile/ProfileChecklist';

function LinkedInModule() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ headline: '', summary: '', profileUrl: '' });
  const [generatedPost, setGeneratedPost] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // profile, checklist, posts

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/linkedin/profile');
      setProfile(response.data);
      setFormData({
        headline: response.data.headline || '',
        summary: response.data.summary || '',
        profileUrl: response.data.profileUrl || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/linkedin/profile', formData);
      fetchProfile();
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile');
    }
  };

  const generatePost = async () => {
    try {
      const response = await axios.post('/linkedin/generate-post', {
        topic: 'Career Development',
        tone: 'professional'
      });
      setGeneratedPost(response.data.post);
    } catch (error) {
      alert('Failed to generate post');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">LinkedIn Profile Optimization</h1>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'profile'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('checklist')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'checklist'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Profile Checklist
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === 'posts'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            AI Post Generator
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="text-center">
            <div className="w-24 h-24 bg-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
              {profile?.completenessScore || 0}%
            </div>
            <h3 className="font-bold text-gray-800 mb-2">Profile Completeness</h3>
            <p className="text-sm text-gray-600">Keep improving your profile!</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h3 className="font-bold text-gray-800 mb-4">Profile Suggestions</h3>
          <div className="space-y-2">
            {profile?.suggestions?.slice(0, 3).map((suggestion, i) => (
              <div key={i} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <span className="text-2xl">{suggestion.completed ? '✅' : '⚠️'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{suggestion.suggestion}</p>
                  <p className="text-xs text-gray-500">Priority: {suggestion.priority}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Update Profile</h2>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
            <input
              type="url"
              value={formData.profileUrl}
              onChange={(e) => setFormData({...formData, profileUrl: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
            <input
              type="text"
              value={formData.headline}
              onChange={(e) => setFormData({...formData, headline: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Software Engineer | AI Enthusiast"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Summary</label>
            <textarea
              value={formData.summary}
              onChange={(e) => setFormData({...formData, summary: e.target.value})}
              className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Write a compelling summary about yourself..."
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Update Profile
          </button>
        </form>
      </div>
        </>
      )}

      {activeTab === 'checklist' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <ProfileChecklist />
        </div>
      )}

      {activeTab === 'posts' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">AI Post Generator</h2>
          <button
            onClick={generatePost}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition mb-4"
          >
            Generate LinkedIn Post
          </button>
          {generatedPost && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{generatedPost}</pre>
              <button
                onClick={() => navigator.clipboard.writeText(generatedPost)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
              >
                Copy to Clipboard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LinkedInModule;
