// ==========================================
// src/screens/Mentorship/MentorshipScreen.js
// ==========================================
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner';

function MentorshipScreen() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await api.get('/mentors');
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestMentorship = async (mentorId) => {
    try {
      await api.post(`/mentors/${mentorId}/request`);
      alert('Mentorship request sent successfully!');
    } catch (error) {
      alert('Failed to send request');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading mentors..." />;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Find a Mentor</h1>

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

              <p className="text-gray-700 mb-4">{mentor.bio}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise?.map((skill, i) => (
                    <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

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
    </div>
  );
}

export default MentorshipScreen;