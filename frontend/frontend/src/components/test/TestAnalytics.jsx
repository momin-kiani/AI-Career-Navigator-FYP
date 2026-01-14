// components/test/TestAnalytics.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function TestAnalytics({ onBack }) {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await axios.get('/test/list');
      setTests(response.data);
    } catch (error) {
      alert('Failed to fetch tests: ' + (error.response?.data?.error || error.message));
    }
  };

  const fetchAnalytics = async (testId) => {
    setLoading(true);
    try {
      const response = await axios.get(`/test/analytics/${testId}`);
      setAnalytics(response.data);
    } catch (error) {
      alert('Failed to fetch analytics: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Test Analytics</h2>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Test</label>
          <select
            value={selectedTest || ''}
            onChange={(e) => {
              setSelectedTest(e.target.value);
              if (e.target.value) {
                fetchAnalytics(e.target.value);
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a test...</option>
            {tests.map(test => (
              <option key={test._id} value={test._id}>
                {test.title} ({test.field})
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      ) : analytics ? (
        <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Total Attempts</h3>
              <p className="text-3xl font-bold">{analytics.totalAttempts}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Total Students</h3>
              <p className="text-3xl font-bold">{analytics.totalStudents}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Average Score</h3>
              <p className="text-3xl font-bold">{analytics.averageScore}%</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Pass Rate</h3>
              <p className="text-3xl font-bold">{analytics.passRate}%</p>
            </div>
          </div>

          {analytics.scoreDistribution && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Score Distribution</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Excellent (90-100%)</span>
                    <span className="font-semibold">{analytics.scoreDistribution.excellent}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full"
                      style={{ width: `${(analytics.scoreDistribution.excellent / analytics.totalAttempts) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Good (80-89%)</span>
                    <span className="font-semibold">{analytics.scoreDistribution.good}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-500 h-3 rounded-full"
                      style={{ width: `${(analytics.scoreDistribution.good / analytics.totalAttempts) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Average (70-79%)</span>
                    <span className="font-semibold">{analytics.scoreDistribution.average}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full"
                      style={{ width: `${(analytics.scoreDistribution.average / analytics.totalAttempts) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Below Average (60-69%)</span>
                    <span className="font-semibold">{analytics.scoreDistribution.belowAverage}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full"
                      style={{ width: `${(analytics.scoreDistribution.belowAverage / analytics.totalAttempts) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Fail (&lt;60%)</span>
                    <span className="font-semibold">{analytics.scoreDistribution.fail}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{ width: `${(analytics.scoreDistribution.fail / analytics.totalAttempts) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Performance Metrics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Time Spent</p>
                <p className="text-2xl font-bold text-gray-800">
                  {analytics.averageTimeSpent?.toFixed(1)} minutes
                </p>
              </div>
              {analytics.fieldPerformance && (
                <div>
                  <p className="text-sm text-gray-600 mb-1">Field Performance</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {analytics.fieldPerformance.field}
                  </p>
                  <p className="text-sm text-gray-600">
                    Avg: {analytics.fieldPerformance.averageScore}%
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-500 text-lg">Select a test to view analytics</p>
        </div>
      )}

      <button
        onClick={onBack}
        className="bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-700 transition"
      >
        Back
      </button>
    </div>
  );
}

export default TestAnalytics;
