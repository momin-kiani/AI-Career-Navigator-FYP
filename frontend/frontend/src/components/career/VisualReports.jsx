// components/career/VisualReports.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function VisualReports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/career/visual-report');
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Generating visual reports...</p>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-600">Unable to load report data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Visual Progress Reports</h2>

      {/* Statistics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{reportData.stats.resumes}</div>
          <div className="text-sm text-gray-600">Resumes</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">{reportData.stats.jobApplications}</div>
          <div className="text-sm text-gray-600">Applications</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-1">{reportData.stats.contacts}</div>
          <div className="text-sm text-gray-600">Contacts</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-1">{reportData.stats.assessments}</div>
          <div className="text-sm text-gray-600">Assessments</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">{reportData.stats.badges}</div>
          <div className="text-sm text-gray-600">Badges</div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4 text-center">
          <div className="text-3xl font-bold text-pink-600 mb-1">{reportData.stats.documents}</div>
          <div className="text-sm text-gray-600">Documents</div>
        </div>
      </div>

      {/* Progress by Module */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Progress by Module</h3>
        <div className="space-y-4">
          {reportData.progressByModule && reportData.progressByModule.length > 0 ? (
            reportData.progressByModule.map((module, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{module.module}</span>
                  <span className="text-gray-600 font-medium">{module.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-600 h-4 rounded-full transition-all"
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">No progress data available</p>
          )}
        </div>
      </div>

      {/* Activity Distribution */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Activity Distribution</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {reportData.activityDistribution && reportData.activityDistribution.length > 0 ? (
            reportData.activityDistribution.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="text-2xl font-bold text-gray-800 mb-1">{item.count}</div>
                <div className="text-sm text-gray-600">{item.type}</div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center py-4">No activity data available</p>
          )}
        </div>
      </div>

      {/* Activity Timeline (Last 30 Days) */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Activity Timeline (Last 30 Days)</h3>
        {reportData.activityTimeline && reportData.activityTimeline.length > 0 ? (
          <div className="space-y-2">
            {reportData.activityTimeline.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 text-sm text-gray-600">{new Date(item.date).toLocaleDateString()}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-blue-600 h-6 rounded-full flex items-center justify-center text-white text-xs font-semibold"
                    style={{ width: `${Math.min((item.count / Math.max(...reportData.activityTimeline.map(a => a.count))) * 100, 100)}%` }}
                  >
                    {item.count} {item.count === 1 ? 'activity' : 'activities'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No activity in the last 30 days</p>
        )}
      </div>

      {/* Insights */}
      {reportData.insights && reportData.insights.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Insights & Recommendations</h3>
          <div className="space-y-3">
            {reportData.insights.map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  insight.type === 'success' ? 'bg-green-50 border border-green-200' :
                  insight.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                  'bg-blue-50 border border-blue-200'
                }`}
              >
                <p className={`font-semibold ${
                  insight.type === 'success' ? 'text-green-800' :
                  insight.type === 'warning' ? 'text-yellow-800' :
                  'text-blue-800'
                }`}>
                  {insight.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default VisualReports;
