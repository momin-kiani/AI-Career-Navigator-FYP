// components/profile/BadgeDisplay.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function BadgeDisplay() {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/profile/badges');
      setBadges(response.data);
    } catch (error) {
      console.error('Error fetching badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkBadges = async () => {
    setChecking(true);
    try {
      const response = await axios.post('/profile/check-badges');
      if (response.data.issuedBadges > 0) {
        alert(`Congratulations! You earned ${response.data.issuedBadges} new badge(s)!`);
        fetchBadges();
      } else {
        alert('No new badges available. Keep optimizing your profile!');
      }
    } catch (error) {
      alert('Failed to check badges: ' + (error.response?.data?.error || error.message));
    } finally {
      setChecking(false);
    }
  };

  const badgeIcons = {
    'profile-optimized': '🏆',
    'linkedin-complete': '💼',
    'resume-optimized': '📄',
    'network-active': '🌐',
    'career-ready': '🎯'
  };

  const badgeColors = {
    'profile-optimized': 'from-yellow-400 to-yellow-600',
    'linkedin-complete': 'from-blue-400 to-blue-600',
    'resume-optimized': 'from-green-400 to-green-600',
    'network-active': 'from-purple-400 to-purple-600',
    'career-ready': 'from-red-400 to-red-600'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading badges...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Profile Badges & Certifications</h2>
        <button
          onClick={checkBadges}
          disabled={checking}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {checking ? 'Checking...' : 'Check for New Badges'}
        </button>
      </div>

      {badges.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="text-6xl mb-4">🎖️</div>
          <p className="text-gray-500 text-lg mb-4">No badges earned yet</p>
          <p className="text-gray-400 mb-6">
            Complete your profile, optimize your resume and LinkedIn to earn badges!
          </p>
          <button
            onClick={checkBadges}
            disabled={checking}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            Check Eligibility
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map((badge) => (
            <div
              key={badge._id}
              className={`bg-gradient-to-br ${badgeColors[badge.badgeType] || 'from-gray-400 to-gray-600'} rounded-xl shadow-md p-6 text-white`}
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{badgeIcons[badge.badgeType] || '🏅'}</div>
                <h3 className="text-2xl font-bold mb-2">{badge.badgeName}</h3>
                <p className="text-white opacity-90 mb-4">{badge.description}</p>
                <div className="text-sm opacity-75">
                  Issued {new Date(badge.issuedAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Badge Criteria */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Badge Criteria</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-yellow-500 pl-4">
            <h4 className="font-semibold text-gray-800 mb-1">🏆 Profile Optimized</h4>
            <p className="text-sm text-gray-600">Achieve 90%+ profile completeness score</p>
          </div>
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold text-gray-800 mb-1">💼 LinkedIn Complete</h4>
            <p className="text-sm text-gray-600">Achieve 80%+ LinkedIn profile completeness</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold text-gray-800 mb-1">📄 Resume Optimized</h4>
            <p className="text-sm text-gray-600">Achieve 80%+ ATS score on your resume</p>
          </div>
        </div>
      </div>

      {/* Badge System Explanation */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-2">How Badges Work</h3>
        <p className="text-sm text-blue-700">
          Badges are automatically issued when you meet specific criteria. The system checks your profile completeness, 
          LinkedIn optimization, and resume ATS scores. Click "Check for New Badges" to see if you've qualified for any 
          new certifications. Badges serve as recognition of your profile optimization achievements.
        </p>
      </div>
    </div>
  );
}

export default BadgeDisplay;
