// pages/StudentTestModule.jsx
import React, { useState, useEffect } from 'react';
import axios from '../services/api';
import TestCreation from '../components/test/TestCreation';
import TestList from '../components/test/TestList';
import TestAttempt from '../components/test/TestAttempt';
import TestResults from '../components/test/TestResults';
import TestAnalytics from '../components/test/TestAnalytics';

function StudentTestModule() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('list'); // list, create, attempt, results, analytics
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedAttempt, setSelectedAttempt] = useState(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Student Test Module</h1>
        <div className="flex space-x-4">
          {isAdmin && (
            <>
              <button
                onClick={() => setView('create')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Create Test
              </button>
              <button
                onClick={() => setView('analytics')}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
              >
                Analytics
              </button>
            </>
          )}
          <button
            onClick={() => {
              setView('list');
              setSelectedTest(null);
              setSelectedAttempt(null);
            }}
            className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            All Tests
          </button>
        </div>
      </div>

      {view === 'list' && (
        <TestList
          isAdmin={isAdmin}
          isStudent={isStudent}
          onStartTest={(test) => {
            setSelectedTest(test);
            setView('attempt');
          }}
          onViewResults={(attempt) => {
            setSelectedAttempt(attempt);
            setView('results');
          }}
        />
      )}

      {view === 'create' && isAdmin && (
        <TestCreation
          onBack={() => setView('list')}
          onTestCreated={() => setView('list')}
        />
      )}

      {view === 'attempt' && selectedTest && isStudent && (
        <TestAttempt
          test={selectedTest}
          onComplete={(attempt) => {
            setSelectedAttempt(attempt);
            setView('results');
          }}
          onBack={() => {
            setSelectedTest(null);
            setView('list');
          }}
        />
      )}

      {view === 'results' && selectedAttempt && (
        <TestResults
          attempt={selectedAttempt}
          onBack={() => {
            setSelectedAttempt(null);
            setView('list');
          }}
          onRetake={(test) => {
            setSelectedTest(test);
            setView('attempt');
          }}
        />
      )}

      {view === 'analytics' && isAdmin && (
        <TestAnalytics onBack={() => setView('list')} />
      )}
    </div>
  );
}

export default StudentTestModule;
