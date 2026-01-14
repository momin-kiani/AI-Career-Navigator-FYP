// components/career/ProgressDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function ProgressDashboard() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/career/progress');
      setProgress(response.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (progressValue) => {
    if (progressValue >= 80) return 'from-green-500 to-green-600';
    if (progressValue >= 50) return 'from-blue-500 to-blue-600';
    if (progressValue >= 25) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading progress...</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <p className="text-gray-600">Unable to load progress data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <div className={`bg-gradient-to-br ${getProgressColor(progress.overall.overallProgress)} rounded-xl shadow-md p-8 text-white`}>
        <div className="text-center">
          <div className="text-6xl font-bold mb-2">{progress.overall.overallProgress}%</div>
          <div className="text-2xl mb-2">Overall Progress</div>
          <p className="text-lg opacity-90">
            {progress.overall.completedModules} of {progress.overall.moduleCount} modules completed
          </p>
        </div>
      </div>

      {/* Module Progress */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Module Progress</h2>
        <div className="space-y-4">
          {progress.modules && progress.modules.length > 0 ? (
            progress.modules.map((module) => (
              <div key={module._id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-800">{module.moduleName}</span>
                  <span className="text-gray-600 font-medium">{module.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${getProgressColor(module.progress)} h-3 rounded-full transition-all`}
                    style={{ width: `${module.progress}%` }}
                  />
                </div>
                {module.completedTasks && module.completedTasks.length > 0 && (
                  <div className="mt-3 text-sm text-gray-600">
                    <span className="font-semibold">Completed Tasks:</span> {module.completedTasks.length}
                  </div>
                )}
                {module.milestones && module.milestones.length > 0 && (
                  <div className="mt-1 text-sm text-gray-600">
                    <span className="font-semibold">Milestones:</span> {module.milestones.length}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No progress tracked yet. Start using the platform to track your career journey!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProgressDashboard;
