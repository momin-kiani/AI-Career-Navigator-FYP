// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configure axios defaults
const API_URL = 'http://localhost:5000/api';
axios.defaults.baseURL = API_URL;

function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/user/profile');
      setUser(response.data);
      setCurrentPage('dashboard');
    } catch (error) {
      console.error('Error fetching profile:', error);
      localStorage.removeItem('token');
      setToken(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCurrentPage('login');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!token ? (
        currentPage === 'login' ? (
          <LoginPage setToken={setToken} setCurrentPage={setCurrentPage} />
        ) : (
          <SignupPage setToken={setToken} setCurrentPage={setCurrentPage} />
        )
      ) : (
        <MainApp 
          user={user} 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          handleLogout={handleLogout}
        />
      )}
    </div>
  );
}

// Login Component
function LoginPage({ setToken, setCurrentPage }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/signin', formData);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Sign in to AI Career Navigator</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={() => setCurrentPage('signup')}
              className="text-blue-600 font-semibold hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Signup Component
function SignupPage({ setToken, setCurrentPage }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/auth/signup', formData);
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Create Account</h2>
        <p className="text-gray-600 mb-6">Join AI Career Navigator today</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="••••••••"
              minLength="6"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={() => setCurrentPage('login')}
              className="text-purple-600 font-semibold hover:underline"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function MainApp({ user, currentPage, setCurrentPage, handleLogout }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">CareerX</h1>
          <p className="text-sm text-gray-600 mt-1">AI Career Navigator</p>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem icon="📊" label="Dashboard" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
          <NavItem icon="📄" label="Resume" active={currentPage === 'resume'} onClick={() => setCurrentPage('resume')} />
          <NavItem icon="💼" label="Job Applications" active={currentPage === 'jobs'} onClick={() => setCurrentPage('jobs')} />
          <NavItem icon="🔗" label="LinkedIn" active={currentPage === 'linkedin'} onClick={() => setCurrentPage('linkedin')} />
          <NavItem icon="🎯" label="Career Assessment" active={currentPage === 'assessment'} onClick={() => setCurrentPage('assessment')} />
          <NavItem icon="👥" label="Mentorship" active={currentPage === 'mentorship'} onClick={() => setCurrentPage('mentorship')} />
          <NavItem icon="📈" label="Market Insights" active={currentPage === 'market'} onClick={() => setCurrentPage('market')} />
          <NavItem icon="💬" label="AI Assistant" active={currentPage === 'chat'} onClick={() => setCurrentPage('chat')} />
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {currentPage === 'dashboard' && <Dashboard user={user} />}
        {currentPage === 'resume' && <ResumeModule />}
        {currentPage === 'jobs' && <JobApplicationsModule />}
        {currentPage === 'linkedin' && <LinkedInModule />}
        {currentPage === 'assessment' && <AssessmentModule />}
        {currentPage === 'mentorship' && <MentorshipModule />}
        {currentPage === 'market' && <MarketInsightsModule />}
        {currentPage === 'chat' && <ChatModule />}
      </main>
    </div>
  );
}

// Navigation Item Component
function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
        active 
          ? 'bg-blue-50 text-blue-600 font-semibold' 
          : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <span className="text-xl">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

// Dashboard Component
function Dashboard({ user }) {
  const [stats, setStats] = useState({
    applications: 0,
    interviews: 0,
    atsScore: 0
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [appsResponse, resumeResponse] = await Promise.all([
        axios.get('/jobs/applications'),
        axios.get('/resume/list')
      ]);

      setStats({
        applications: appsResponse.data.length,
        interviews: appsResponse.data.filter(app => app.status === 'interviewing').length,
        atsScore: resumeResponse.data[0]?.atsScore || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.firstName}!</h1>
      <p className="text-gray-600 mb-8">Here's your career dashboard overview</p>

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
          <QuickAction icon="📄" label="Upload Resume" />
          <QuickAction icon="🔍" label="Search Jobs" />
          <QuickAction icon="📊" label="View Analytics" />
          <QuickAction icon="💬" label="AI Assistant" />
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle, color }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center text-2xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
      <p className="text-gray-500 text-sm">{subtitle}</p>
    </div>
  );
}

function QuickAction({ icon, label }) {
  return (
    <button className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition">
      <span className="text-3xl mb-2">{icon}</span>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </button>
  );
}

// Resume Module Component
function ResumeModule() {
  const [resumes, setResumes] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [resumeContent, setResumeContent] = useState('');

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

  const handleUpload = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      await axios.post('/resume/upload', {
        fileName: 'Resume.pdf',
        content: resumeContent
      });
      
      setResumeContent('');
      fetchResumes();
      alert('Resume uploaded successfully!');
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Resume Optimization</h1>

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Upload New Resume</h2>
        <form onSubmit={handleUpload}>
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

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Resumes</h2>
        <div className="space-y-4">
          {resumes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No resumes uploaded yet</p>
          ) : (
            resumes.map((resume) => (
              <div key={resume._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{resume.fileName || 'Resume'}</h3>
                    <p className="text-sm text-gray-500">
                      Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{resume.atsScore}%</div>
                    <div className="text-sm text-gray-500">ATS Score</div>
                  </div>
                </div>
                
                {resume.analysis && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-2">Strengths</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {resume.analysis.strengths?.map((strength, i) => (
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
  );
}

// Job Applications Module
function JobApplicationsModule() {
  const [applications, setApplications] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    jobUrl: '',
    status: 'saved'
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await axios.get('/jobs/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/jobs/applications', formData);
      setFormData({ jobTitle: '', company: '', jobUrl: '', status: 'saved' });
      setShowForm(false);
      fetchApplications();
      alert('Application added successfully!');
    } catch (error) {
      alert('Failed to add application');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/jobs/applications/${id}`, { status });
      fetchApplications();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const statusColors = {
    saved: 'bg-gray-100 text-gray-700',
    applied: 'bg-blue-100 text-blue-700',
    interviewing: 'bg-yellow-100 text-yellow-700',
    offered: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700'
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Job Applications</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add Application'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Add New Application</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
              <input
                type="text"
                required
                value={formData.jobTitle}
                onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job URL</label>
              <input
                type="url"
                value={formData.jobUrl}
                onChange={(e) => setFormData({...formData, jobUrl: e.target.value})}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Add Application
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">No applications yet. Start tracking your job search!</p>
          </div>
        ) : (
          applications.map((app) => (
            <div key={app._id} className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{app.jobTitle}</h3>
                  <p className="text-gray-600">{app.company}</p>
                  {app.jobUrl && (
                    <a href={app.jobUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                      View Job Posting →
                    </a>
                  )}
                </div>
                <select
                  value={app.status}
                  onChange={(e) => updateStatus(app._id, e.target.value)}
                  className={`px-4 py-2 rounded-lg font-semibold ${statusColors[app.status]}`}
                >
                  <option value="saved">Saved</option>
                  <option value="applied">Applied</option>
                  <option value="interviewing">Interviewing</option>
                  <option value="offered">Offered</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span>📅 Added {new Date(app.createdAt).toLocaleDateString()}</span>
                {app.appliedDate && (
                  <span>✉️ Applied {new Date(app.appliedDate).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// LinkedIn Module Component
function LinkedInModule() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ headline: '', summary: '', profileUrl: '' });
  const [generatedPost, setGeneratedPost] = useState('');

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
    </div>
  );
}

// Assessment Module Component
function AssessmentModule() {
  const [assessments, setAssessments] = useState([]);
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState([]);

  const questions = [
    { id: 1, question: "I enjoy working with data and numbers", type: "analytical" },
    { id: 2, question: "I prefer leading teams rather than working alone", type: "leadership" },
    { id: 3, question: "I am creative and enjoy innovative solutions", type: "creative" },
    { id: 4, question: "I pay close attention to details", type: "detail" },
    { id: 5, question: "I enjoy public speaking and presentations", type: "communication" }
  ];

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const response = await axios.get('/assessment/results');
      setAssessments(response.data);
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const handleAnswer = (answer) => {
    const newResponses = [...responses, { questionId: questions[currentQuestion].id, answer }];
    setResponses(newResponses);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAssessment(newResponses);
    }
  };

  const submitAssessment = async (finalResponses) => {
    try {
      await axios.post('/assessment/submit', {
        assessmentType: 'personality',
        responses: finalResponses
      });
      setShowTest(false);
      setCurrentQuestion(0);
      setResponses([]);
      fetchAssessments();
      alert('Assessment completed successfully!');
    } catch (error) {
      alert('Failed to submit assessment');
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Career Assessment</h1>
        {!showTest && (
          <button
            onClick={() => setShowTest(true)}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Take Assessment
          </button>
        )}
      </div>

      {showTest ? (
        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8">{questions[currentQuestion].question}</h2>

          <div className="space-y-3">
            {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index + 1)}
                className="w-full py-4 px-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-left font-medium"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {assessments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No assessments completed yet</p>
              <p className="text-gray-400">Take your first career assessment to discover your strengths!</p>
            </div>
          ) : (
            assessments.map((assessment) => (
              <div key={assessment._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Career Assessment Results</h3>
                    <p className="text-gray-600">Completed {new Date(assessment.completedAt).toLocaleDateString()}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg font-semibold">
                    {assessment.results.personalityType}
                  </span>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-3">Recommended Careers</h4>
                  <div className="space-y-2">
                    {assessment.results.recommendedCareers?.slice(0, 3).map((career, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium text-gray-800">{career.title}</span>
                        <span className="text-purple-600 font-semibold">{career.matchScore}% Match</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Skill Gaps</h4>
                  <div className="space-y-2">
                    {assessment.results.skillGaps?.slice(0, 3).map((gap, i) => (
                      <div key={i} className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-800">{gap.skill}</span>
                          <span className="text-sm text-gray-600">Priority: {gap.priority}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${(gap.currentLevel / gap.requiredLevel) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Mentorship Module Component
function MentorshipModule() {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const response = await axios.get('/mentors');
      setMentors(response.data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setLoading(false);
    }
  };

  const requestMentorship = async (mentorId) => {
    try {
      await axios.post(`/mentors/${mentorId}/request`);
      alert('Mentorship request sent successfully!');
    } catch (error) {
      alert('Failed to send request');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Find a Mentor</h1>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading mentors...</p>
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
      )}
    </div>
  );
}

// Market Insights Module Component
function MarketInsightsModule() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    try {
      const response = await axios.get('/market/insights');
      setInsights(response.data);
    } catch (error) {
      console.error('Error fetching insights:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Labor Market Insights</h1>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading market data...</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">High Demand Jobs</h3>
              <p className="text-3xl font-bold">250+</p>
              <p className="text-blue-100 text-sm">Active openings</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Avg. Salary Growth</h3>
              <p className="text-3xl font-bold">+12%</p>
              <p className="text-green-100 text-sm">Year over year</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-2">Emerging Skills</h3>
              <p className="text-3xl font-bold">15+</p>
              <p className="text-purple-100 text-sm">Trending technologies</p>
            </div>
          </div>

          {insights.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <p className="text-gray-500 text-lg">No market data available</p>
            </div>
          ) : (
            insights.map((insight) => (
              <div key={insight._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{insight.jobTitle}</h3>
                    <p className="text-gray-600">{insight.industry}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{insight.demandScore}/100</div>
                    <div className="text-sm text-gray-500">Demand Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Salary Range</h4>
                    <p className="text-lg font-bold text-gray-800">
                      ${insight.salaryRange?.min?.toLocaleString()} - ${insight.salaryRange?.max?.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Median: ${insight.salaryRange?.median?.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Growth Projection</h4>
                    <p className="text-lg font-bold text-green-600">+{insight.growthProjection?.fiveYear}%</p>
                    <p className="text-sm text-gray-600">5-year forecast</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Top Required Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {insight.requiredSkills?.slice(0, 8).map((skill, i) => (
                      <span key={i} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                        {skill.skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// Chat Module Component
function ChatModule() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { role: 'user', content: inputMessage };
    setMessages([...messages, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/chat/message', {
        message: inputMessage,
        category: 'career-guidance'
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex flex-col h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Career Assistant</h1>

      <div className="flex-1 bg-white rounded-xl shadow-md p-6 mb-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">How can I help you today?</h3>
              <p className="text-gray-600">Ask me about career guidance, resume tips, job search strategies, and more!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex space-x-4">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-6 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default App;