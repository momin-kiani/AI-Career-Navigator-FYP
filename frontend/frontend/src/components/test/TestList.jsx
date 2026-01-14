// components/test/TestList.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function TestList({ isAdmin, isStudent, onStartTest, onViewResults }) {
  const [tests, setTests] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    field: '',
    difficulty: ''
  });

  useEffect(() => {
    fetchTests();
    if (isStudent) {
      fetchAttempts();
    }
  }, [isStudent]);

  const fetchTests = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.field) params.field = filters.field;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      params.isActive = 'true';

      const response = await axios.get('/test/list', { params });
      setTests(response.data);
    } catch (error) {
      alert('Failed to fetch tests: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchAttempts = async () => {
    try {
      const response = await axios.get('/test/student/attempts');
      setAttempts(response.data);
    } catch (error) {
      console.error('Error fetching attempts:', error);
    }
  };

  const getAttemptForTest = (testId) => {
    return attempts.find(a => a.testId._id === testId);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Tests</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
            <select
              value={filters.field}
              onChange={(e) => setFilters({...filters, field: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Fields</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Web3">Web3</option>
              <option value="DevOps">DevOps</option>
              <option value="Full-Stack">Full-Stack</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchTests}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tests...</p>
        </div>
      ) : tests.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">No tests available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tests.map((test) => {
            const attempt = getAttemptForTest(test._id);
            return (
              <div key={test._id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{test.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{test.field} • {test.difficulty}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    test.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {test.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                {test.description && (
                  <p className="text-gray-700 mb-4">{test.description}</p>
                )}

                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-600">Questions</p>
                    <p className="font-semibold text-gray-800">{test.totalQuestions}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Marks</p>
                    <p className="font-semibold text-gray-800">{test.totalMarks}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-800">
                      {test.duration ? `${test.duration} min` : 'No limit'}
                    </p>
                  </div>
                </div>

                {isStudent && (
                  <div className="flex space-x-2">
                    {attempt ? (
                      <>
                        <button
                          onClick={() => onViewResults(attempt)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                          View Results ({attempt.score?.percentage?.toFixed(0)}%)
                        </button>
                        {attempt.status === 'in-progress' && (
                          <button
                            onClick={() => onStartTest(test)}
                            className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                          >
                            Continue
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => onStartTest(test)}
                        className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
                      >
                        Start Test
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default TestList;
