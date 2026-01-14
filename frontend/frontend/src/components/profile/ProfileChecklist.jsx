// components/profile/ProfileChecklist.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function ProfileChecklist() {
  const [completeness, setCompleteness] = useState(null);
  const [user, setUser] = useState(null);
  const [linkedInProfile, setLinkedInProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [completenessRes, userRes, linkedInRes] = await Promise.all([
        axios.get('/profile/score'),
        axios.get('/user/profile'),
        axios.get('/linkedin/profile').catch(() => null)
      ]);
      setCompleteness(completenessRes.data);
      setUser(userRes.data);
      setLinkedInProfile(linkedInRes?.data || null);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const checklistItems = [
    {
      id: 'name',
      label: 'Full Name',
      checked: !!(user?.firstName && user?.lastName),
      category: 'Basic Info'
    },
    {
      id: 'email',
      label: 'Email Address',
      checked: !!user?.email,
      category: 'Basic Info'
    },
    {
      id: 'location',
      label: 'Location',
      checked: !!(user?.location && (user.location.city || user.location.country)),
      category: 'Basic Info'
    },
    {
      id: 'phone',
      label: 'Phone Number',
      checked: !!user?.phoneNumber,
      category: 'Contact'
    },
    {
      id: 'profileImage',
      label: 'Profile Image',
      checked: !!user?.profileImage,
      category: 'Contact'
    },
    {
      id: 'linkedIn',
      label: 'LinkedIn URL',
      checked: !!user?.linkedInUrl,
      category: 'Links'
    },
    {
      id: 'github',
      label: 'GitHub URL',
      checked: !!user?.githubUrl,
      category: 'Links'
    },
    {
      id: 'portfolio',
      label: 'Portfolio URL',
      checked: !!user?.portfolioUrl,
      category: 'Links'
    },
    {
      id: 'headline',
      label: 'Professional Headline',
      checked: !!(linkedInProfile?.headline && linkedInProfile.headline.length > 20),
      category: 'Content'
    },
    {
      id: 'summary',
      label: 'Profile Summary',
      checked: !!(linkedInProfile?.summary && linkedInProfile.summary.length > 100),
      category: 'Content'
    },
    {
      id: 'emailVerified',
      label: 'Email Verified',
      checked: !!user?.isEmailVerified,
      category: 'Additional'
    }
  ];

  const groupedItems = checklistItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {});

  const completedCount = checklistItems.filter(item => item.checked).length;
  const totalCount = checklistItems.length;
  const completionPercentage = Math.round((completedCount / totalCount) * 100);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading checklist...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
        <div className="text-center">
          <div className="text-4xl font-bold mb-2">{completionPercentage}%</div>
          <div className="text-lg mb-2">Profile Complete</div>
          <div className="text-sm opacity-90">
            {completedCount} of {totalCount} items completed
          </div>
        </div>
        <div className="mt-4 w-full bg-blue-400 rounded-full h-3">
          <div
            className="bg-white h-3 rounded-full transition-all"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Checklist by Category */}
      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items]) => (
          <div key={category} className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">{category}</h3>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center p-4 rounded-lg border-2 transition ${
                    item.checked
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 ${
                    item.checked ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {item.checked && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={`font-medium flex-1 ${
                    item.checked ? 'text-gray-700 line-through' : 'text-gray-800'
                  }`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-4">
          <a
            href="/profile"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition text-center"
          >
            Update Profile
          </a>
          <a
            href="/linkedin"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition text-center"
          >
            Optimize LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProfileChecklist;
