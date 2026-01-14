// components/mentorship/MentorMatching.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function MentorMatching() {
  const [mentors, setMentors] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [matching, setMatching] = useState(false);
  const [matchQuery, setMatchQuery] = useState({
    targetRole: '',
    industry: ''
  });

  useEffect(() => {
    fetchMentors();
    fetchRecommendations();
  }, []);

  const fetchMentors = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/mentors');
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await axios.get('/mentorship/ai-recommendations');
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleMatch = async (e) => {
    e.preventDefault();
    setMatching(true);
    try {
      const response = await axios.post('/mentors/match', matchQuery);
      setMentors(response.data.matches.map(m => m.mentor));
    } catch (error) {
      alert('Failed to match mentors: ' + (error.response?.data?.error || error.message));
    } finally {
      setMatching(false);
    }
  };

  const requestMentorship = async (mentorId) => {
    try {
      await axios.post(`/mentors/${mentorId}/request`);
      alert('Mentorship request sent successfully!');
      fetchMentors();
    } catch (error) {
      alert('Failed to send request: ' + (error.response?.data?.error || error.message));
    }
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'bg-green-100 text-green-700';
    if (score >= 60) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="space-y-6">
      {/* AI Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">🤖 AI Recommendations</h2>
          <p className="mb-4 opacity-90">{recommendations[0]?.reasoning || 'Top mentor matches based on your profile'}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.slice(0, 2).map((rec, index) => (
              <div key={index} className="bg-white bg-opacity-20 rounded-lg p-4">
                <h3 className="font-bold text-lg mb-2">
                  {rec.mentor?.userId?.firstName} {rec.mentor?.userId?.lastName}
                </h3>
                <p className="text-sm opacity-90">{rec.mentor?.currentRole} at {rec.mentor?.company}</p>
                <div className="mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(rec.matchScore)}`}>
                    {rec.matchScore}% Match
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match Form */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Find Your Perfect Mentor</h2>
        <form onSubmit={handleMatch} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Target Role</label>
              <input
                type="text"
                value={matchQuery.targetRole}
                onChange={(e) => setMatchQuery({...matchQuery, targetRole: e.target.value})}
                placeholder="e.g., Software Engineer"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
              <input
                type="text"
                value={matchQuery.industry}
                onChange={(e) => setMatchQuery({...matchQuery, industry: e.target.value})}
                placeholder="e.g., Technology"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={matching}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {matching ? 'Matching...' : 'Find Matching Mentors'}
          </button>
        </form>
      </div>

      {/* Mentors List */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentors...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mentors.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No mentors available at the moment</p>
            </div>
          ) : (
            mentors.map((mentor) => (
              <div key={mentor._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {mentor.userId?.firstName?.[0]}{mentor.userId?.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800">
                      {mentor.userId?.firstName} {mentor.userId?.lastName}
                    </h3>
                    <p className="text-gray-600">{mentor.currentRole} at {mentor.company}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 ml-1">{mentor.rating || 'N/A'}</span>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-sm text-gray-600">{mentor.yearsOfExperience} years exp.</span>
                    </div>
                  </div>
                </div>

                {mentor.bio && (
                  <p className="text-gray-700 mb-4">{mentor.bio}</p>
                )}

                {mentor.expertise && mentor.expertise.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                      {mentor.expertise.map((skill, i) => (
                        <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => requestMentorship(mentor._id)}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Request Mentorship
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default MentorMatching;
