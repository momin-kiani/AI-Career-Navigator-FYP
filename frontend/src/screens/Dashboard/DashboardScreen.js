// src/screens/Dashboard/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import StatCard from '../../components/StatCard';
import QuickAction from '../../components/QuickAction';

function DashboardScreen() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    atsScore: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [appsResponse, resumeResponse] = await Promise.all([
        api.get('/jobs/applications'),
        api.get('/resume/list')
      ]);

      setStats({
        applications: appsResponse.data.length,
        interviews: appsResponse.data.filter(app => app.status === 'interviewing').length,
        atsScore: resumeResponse.data[0]?.atsScore || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Welcome back, {user?.firstName}!
      </h1>
      <p className="text-gray-600 mb-8">Here's your career dashboard overview</p>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon="📝"
              title="Applications"
              value={stats.applications}
              subtitle="Total submitted"
              color="blue"
            />
            <StatCard
              icon="🎤"
              title="Interviews"
              value={stats.interviews}
              subtitle="Scheduled"
              color="green"
            />
            <StatCard
              icon="⭐"
              title="ATS Score"
              value={`${stats.atsScore}%`}
              subtitle="Resume rating"
              color="purple"
            />
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickAction 
                icon="📄" 
                label="Upload Resume" 
                onClick={() => navigate('/resume')}
              />
              <QuickAction 
                icon="🔍" 
                label="Track Jobs" 
                onClick={() => navigate('/jobs')}
              />
              <QuickAction 
                icon="📊" 
                label="View Analytics" 
                onClick={() => navigate('/market')}
              />
              <QuickAction 
                icon="💬" 
                label="AI Assistant" 
                onClick={() => navigate('/chat')}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardScreen;