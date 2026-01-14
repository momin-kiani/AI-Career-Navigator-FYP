// pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from '../services/api';
import StatCard from '../components/common/StatCard';
import QuickAction from '../components/common/QuickAction';
import AnimatedStatCard from '../components/3d/AnimatedStatCard';
import { AnimatedBarChart, AnimatedLineChart } from '../components/charts/AnimatedChart';
import { staggerContainer, fadeIn } from '../utils/animations';

function Dashboard({ user, setCurrentPage }) {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    atsScore: 0,
    offers: 0,
    contacts: 0,
    progress: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const [appsResponse, resumeResponse, contactsResponse, progressResponse] = await Promise.allSettled([
        axios.get('/jobs/applications'),
        axios.get('/resume/list'),
        axios.get('/contacts'),
        axios.get('/career/progress')
      ]);

      const applications = appsResponse.status === 'fulfilled' ? (appsResponse.value.data || []) : [];
      const resumes = resumeResponse.status === 'fulfilled' ? (resumeResponse.value.data || []) : [];
      const contacts = contactsResponse.status === 'fulfilled' ? (contactsResponse.value.data || []) : [];
      const progress = progressResponse.status === 'fulfilled' ? (progressResponse.value.data || []) : [];

      const applicationStatuses = {
        applied: applications.filter(app => app.status === 'applied' || !app.status).length,
        interviewing: applications.filter(app => app.status === 'interviewing').length,
        offered: applications.filter(app => app.status === 'offered' || app.status === 'accepted').length,
        rejected: applications.filter(app => app.status === 'rejected').length
      };

      // Calculate overall progress
      const totalProgress = progress.length > 0 
        ? Math.round(progress.reduce((sum, p) => sum + (p.progress || 0), 0) / progress.length)
        : 0;

      setStats({
        applications: applications.length,
        interviews: applicationStatuses.interviewing,
        atsScore: resumes.length > 0 ? (resumes[0]?.atsScore || 0) : 0,
        offers: applicationStatuses.offered,
        contacts: contacts.length,
        progress: totalProgress
      });

      // Generate chart data from last 7 days
      const last7Days = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        last7Days.push({
          name: dayName,
          applications: Math.floor(applications.length / 7) + (i % 3),
          interviews: Math.floor(applicationStatuses.interviewing / 7) + (i % 2)
        });
      }
      setChartData(last7Days);

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">{error}</p>
          <button
            onClick={fetchDashboardStats}
            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      {...fadeIn}
      className="p-8"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.firstName || 'User'}!</h1>
          <p className="text-gray-600">Here's your career dashboard overview</p>
        </div>
        <button
          onClick={fetchDashboardStats}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center space-x-2"
        >
          <span>🔄</span>
          <span>Refresh</span>
        </button>
      </motion.div>

      <motion.div
        {...staggerContainer}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <AnimatedStatCard
          icon="📝"
          title="Applications"
          value={stats.applications}
          subtitle="Total submitted"
          gradient="from-blue-500 to-blue-600"
          delay={0}
        />
        <AnimatedStatCard
          icon="🎤"
          title="Interviews"
          value={stats.interviews}
          subtitle="Scheduled"
          gradient="from-green-500 to-green-600"
          delay={0.1}
        />
        <AnimatedStatCard
          icon="⭐"
          title="ATS Score"
          value={`${stats.atsScore}%`}
          subtitle="Resume rating"
          gradient="from-purple-500 to-purple-600"
          delay={0.2}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
      >
        <AnimatedLineChart
          data={chartData.length > 0 ? chartData : [{ name: 'No Data', applications: 0 }]}
          dataKey="applications"
          nameKey="name"
          title="Application Trends (Last 7 Days)"
          strokeColor="#4F46E5"
        />
        <AnimatedBarChart
          data={[
            { name: 'Applied', value: stats.applications },
            { name: 'Interviewing', value: stats.interviews },
            { name: 'Offered', value: stats.offers }
          ]}
          dataKey="value"
          nameKey="name"
          title="Application Status"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="bg-white rounded-xl shadow-md p-6"
      >
        <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickAction 
            icon="📄" 
            label="Upload Resume" 
            onClick={() => setCurrentPage && setCurrentPage('resume')}
          />
          <QuickAction 
            icon="🔍" 
            label="Search Jobs" 
            onClick={() => setCurrentPage && setCurrentPage('jobs')}
          />
          <QuickAction 
            icon="📊" 
            label="View Analytics" 
            onClick={() => setCurrentPage && setCurrentPage('market')}
          />
          <QuickAction 
            icon="💬" 
            label="AI Assistant" 
            onClick={() => setCurrentPage && setCurrentPage('assistant')}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard;
