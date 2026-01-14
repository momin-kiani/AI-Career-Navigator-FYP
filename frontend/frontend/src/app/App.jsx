// app/App.jsx
import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import axios from '../services/api';
import LoginPage from '../pages/auth/Login';
import SignupPage from '../pages/auth/Signup';
import ForgotPasswordPage from '../pages/auth/ForgotPassword';
import ResetPasswordPage from '../pages/auth/ResetPassword';
import MainApp from '../components/layout/MainApp';

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
      <AnimatePresence mode="wait">
        {!token ? (
          currentPage === 'login' ? (
            <LoginPage key="login" setToken={setToken} setCurrentPage={setCurrentPage} />
          ) : currentPage === 'signup' ? (
            <SignupPage key="signup" setToken={setToken} setCurrentPage={setCurrentPage} />
          ) : currentPage === 'forgot-password' ? (
            <ForgotPasswordPage key="forgot" setCurrentPage={setCurrentPage} />
          ) : currentPage === 'reset-password' ? (
            <ResetPasswordPage key="reset" setCurrentPage={setCurrentPage} />
          ) : (
            <LoginPage key="login-default" setToken={setToken} setCurrentPage={setCurrentPage} />
          )
        ) : (
          <MainApp 
            key="main-app"
            user={user} 
            currentPage={currentPage} 
            setCurrentPage={setCurrentPage}
            handleLogout={handleLogout}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
