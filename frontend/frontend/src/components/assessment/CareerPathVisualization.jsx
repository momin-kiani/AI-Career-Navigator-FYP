// components/assessment/CareerPathVisualization.jsx
import React from 'react';

function CareerPathVisualization({ clusters }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Career Path Clusters</h2>
      <p className="text-gray-600 mb-6">
        Your recommended careers grouped into clusters. Each cluster represents a related career path with similar skill requirements.
      </p>

      <div className="space-y-6">
        {clusters.map((cluster, index) => (
          <div key={index} className="border-2 border-purple-200 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{cluster.clusterName}</h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">{cluster.avgMatchScore}%</div>
                <div className="text-sm text-gray-600">Avg. Match</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {cluster.careers.map((career, i) => (
                <div key={i} className="bg-white rounded-lg p-4 border border-purple-200 hover:shadow-md transition">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium text-gray-800">{career}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-purple-200">
              <p className="text-sm text-gray-600">
                <strong>Cluster Analysis:</strong> Careers in this cluster share similar trait requirements and skill sets. 
                This suggests you could transition between these roles as your career progresses.
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>Clustering Algorithm:</strong> Careers are grouped using similarity-based clustering. 
          Roles with similar trait requirements (70%+ overlap) and comparable match scores are grouped together. 
          This helps identify career paths where you can leverage your strengths across multiple roles.
        </p>
      </div>
    </div>
  );
}

export default CareerPathVisualization;
