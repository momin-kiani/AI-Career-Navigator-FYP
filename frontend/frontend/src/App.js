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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        ) : currentPage === 'signup' ? (
          <SignupPage setToken={setToken} setCurrentPage={setCurrentPage} />
        ) : currentPage === 'forgot-password' ? (
          <ForgotPasswordPage setCurrentPage={setCurrentPage} />
        ) : currentPage === 'reset-password' ? (
          <ResetPasswordPage setCurrentPage={setCurrentPage} />
        ) : (
          <LoginPage setToken={setToken} setCurrentPage={setCurrentPage} />
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
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setValidationErrors({});

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

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      // In production, this would use OAuth libraries (e.g., react-google-login, react-linkedin-login)
      // For now, we'll use a mock implementation that requires manual token input
      // In a real implementation, you would:
      // 1. Redirect to OAuth provider
      // 2. Get callback with access token
      // 3. Send token to backend
      
      // Mock implementation - in production, replace with actual OAuth flow
      const mockToken = prompt(`Enter ${provider} access token (for demo purposes):`);
      if (!mockToken) {
        setLoading(false);
        return;
      }

      // Get user info from provider (in production, verify token with provider API)
      const mockUserInfo = {
        email: prompt('Enter your email:'),
        firstName: prompt('Enter your first name:'),
        lastName: prompt('Enter your last name:'),
        profileImage: ''
      };

      const response = await axios.post('/auth/social-login', {
        provider: provider.toLowerCase(),
        accessToken: mockToken,
        ...mockUserInfo
      });
      
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || `${provider} login failed`);
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
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                if (validationErrors.email) setValidationErrors({...validationErrors, email: ''});
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {validationErrors.email && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                if (validationErrors.password) setValidationErrors({...validationErrors, password: ''});
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationErrors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="••••••••"
            />
            {validationErrors.password && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setCurrentPage('forgot-password')}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => handleSocialLogin('LinkedIn')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" fill="#0077B5" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
          </div>
        </div>

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
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!formData.firstName || formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    if (!formData.lastName || formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setValidationErrors({});

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

  const handleSocialLogin = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      // Mock implementation - in production, replace with actual OAuth flow
      const mockToken = prompt(`Enter ${provider} access token (for demo purposes):`);
      if (!mockToken) {
        setLoading(false);
        return;
      }

      const mockUserInfo = {
        email: prompt('Enter your email:'),
        firstName: prompt('Enter your first name:'),
        lastName: prompt('Enter your last name:'),
        profileImage: ''
      };

      const response = await axios.post('/auth/social-login', {
        provider: provider.toLowerCase(),
        accessToken: mockToken,
        ...mockUserInfo
      });
      
      localStorage.setItem('token', response.data.token);
      setToken(response.data.token);
    } catch (err) {
      setError(err.response?.data?.error || `${provider} signup failed`);
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
                onChange={(e) => {
                  setFormData({...formData, firstName: e.target.value});
                  if (validationErrors.firstName) setValidationErrors({...validationErrors, firstName: ''});
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  validationErrors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="John"
              />
              {validationErrors.firstName && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => {
                  setFormData({...formData, lastName: e.target.value});
                  if (validationErrors.lastName) setValidationErrors({...validationErrors, lastName: ''});
                }}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  validationErrors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
              {validationErrors.lastName && (
                <p className="text-red-600 text-sm mt-1">{validationErrors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => {
                setFormData({...formData, email: e.target.value});
                if (validationErrors.email) setValidationErrors({...validationErrors, email: ''});
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                validationErrors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {validationErrors.email && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                if (validationErrors.password) setValidationErrors({...validationErrors, password: ''});
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                validationErrors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              minLength="6"
            />
            {validationErrors.password && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => handleSocialLogin('Google')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => handleSocialLogin('LinkedIn')}
              disabled={loading}
              className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              <svg className="w-5 h-5 mr-2" fill="#0077B5" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              LinkedIn
            </button>
          </div>
        </div>

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

// Forgot Password Component
function ForgotPasswordPage({ setCurrentPage }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setValidationError('');

    if (!email) {
      setValidationError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      await axios.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Check Your Email</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <button
              onClick={() => setCurrentPage('login')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Forgot Password</h2>
        <p className="text-gray-600 mb-6">Enter your email to receive a password reset link</p>
        
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
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setValidationError('');
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                validationError ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="your@email.com"
            />
            {validationError && (
              <p className="text-red-600 text-sm mt-1">{validationError}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentPage('login')}
            className="text-blue-600 font-semibold hover:underline"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

// Reset Password Component
function ResetPasswordPage({ setCurrentPage }) {
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  // Get token from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (!token) {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters long';
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (!token) {
      setError('Invalid reset link');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await axios.post('/auth/reset-password', {
        token,
        password: formData.password
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-blue-600 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Password Reset Successful</h2>
            <p className="text-gray-600 mb-6">Your password has been reset. You can now sign in with your new password.</p>
            <button
              onClick={() => setCurrentPage('login')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Go to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-600 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p className="text-gray-600 mb-6">Enter your new password</p>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => {
                setFormData({...formData, password: e.target.value});
                if (validationErrors.password) setValidationErrors({...validationErrors, password: ''});
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                validationErrors.password ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              minLength="6"
            />
            {validationErrors.password && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => {
                setFormData({...formData, confirmPassword: e.target.value});
                if (validationErrors.confirmPassword) setValidationErrors({...validationErrors, confirmPassword: ''});
              }}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="••••••••"
              minLength="6"
            />
            {validationErrors.confirmPassword && (
              <p className="text-red-600 text-sm mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentPage('login')}
            className="text-purple-600 font-semibold hover:underline"
          >
            Back to Login
          </button>
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
      <aside className="w-64 bg-white shadow-lg flex flex-col relative">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600">CareerX</h1>
          <p className="text-sm text-gray-600 mt-1">AI Career Navigator</p>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <NavItem icon="📊" label="Dashboard" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
          <NavItem icon="📄" label="Resume" active={currentPage === 'resume'} onClick={() => setCurrentPage('resume')} />
          <NavItem icon="💼" label="Job Applications" active={currentPage === 'jobs'} onClick={() => setCurrentPage('jobs')} />
          <NavItem icon="🔗" label="LinkedIn" active={currentPage === 'linkedin'} onClick={() => setCurrentPage('linkedin')} />
          <NavItem icon="🎯" label="Career Assessment" active={currentPage === 'assessment'} onClick={() => setCurrentPage('assessment')} />
          <NavItem icon="👥" label="Mentorship" active={currentPage === 'mentorship'} onClick={() => setCurrentPage('mentorship')} />
          <NavItem icon="📈" label="Market Insights" active={currentPage === 'market'} onClick={() => setCurrentPage('market')} />
          <NavItem icon="💬" label="AI Assistant" active={currentPage === 'chat'} onClick={() => setCurrentPage('chat')} />
        </nav>

        <div className="p-4 border-t bg-white">
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
    <div className="p-8 flex flex-col h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">AI Career Assistant</h1>

      <div className="flex-1 bg-white rounded-xl shadow-md p-6 mb-4 overflow-y-auto min-h-0">
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