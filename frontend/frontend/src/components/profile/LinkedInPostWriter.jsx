// components/profile/LinkedInPostWriter.jsx
import React, { useState } from 'react';
import axios from '../../services/api';

function LinkedInPostWriter() {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/profile/ai-linkedin-post', {
        topic: topic || null,
        tone
      });
      setPost(response.data);
    } catch (error) {
      alert('Failed to generate post: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (post) {
      const fullPost = `${post.content}\n\n${post.hashtags}`;
      navigator.clipboard.writeText(fullPost);
      alert('Post copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">AI LinkedIn Post Writer</h2>
        <p className="text-gray-600 mb-6">
          Generate engaging LinkedIn posts based on your profile and selected topic.
        </p>

        <form onSubmit={handleGenerate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Topic (Optional)</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Career Development, Technology Trends"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-500 mt-1">Leave empty for AI to select a relevant topic</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="professional">Professional</option>
              <option value="inspirational">Inspirational</option>
              <option value="casual">Casual</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Post'}
          </button>
        </form>
      </div>

      {post && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-800">Generated Post</h3>
              <button
                onClick={copyToClipboard}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Copy Post
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200">
              <p className="text-gray-800 whitespace-pre-wrap mb-4">{post.content}</p>
              <div className="pt-4 border-t border-gray-300">
                <p className="text-blue-600 font-medium">{post.hashtags}</p>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <span>Word Count: {post.wordCount}</span>
              <span>Estimated Read Time: {post.estimatedReadTime} min</span>
              <span>Topic: {post.topic}</span>
              <span>Tone: {post.tone}</span>
            </div>
          </div>

          {post.tips && post.tips.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h4 className="font-semibold text-gray-800 mb-3">Posting Tips</h4>
              <ul className="space-y-2">
                {post.tips.map((tip, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-green-50 rounded-xl p-6">
            <h4 className="text-lg font-bold text-green-800 mb-2">How Post Generation Works</h4>
            <p className="text-sm text-green-700">
              The AI uses template-based generation with tone-specific structures. For professional tone, it uses a 
              Problem-Solution-Benefit framework. For inspirational tone, it focuses on motivation and journey. The 
              algorithm selects relevant hashtags based on the topic and includes a call-to-action to encourage engagement.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default LinkedInPostWriter;
