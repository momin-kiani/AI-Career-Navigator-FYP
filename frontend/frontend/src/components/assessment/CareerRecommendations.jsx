// components/assessment/CareerRecommendations.jsx
import React from 'react';
import { motion } from 'framer-motion';
import CareerPath3D from '../3d/CareerPath3D';
import { hoverScale, staggerContainer } from '../../utils/animations';

function CareerRecommendations({ careers, clusters }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Career Recommendations</h2>
      <p className="text-gray-600 mb-6">
        Careers matched to your personality profile and skills. Match scores indicate how well each role aligns with your assessed traits.
      </p>

      {/* Career Clusters */}
      {clusters && clusters.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Career Clusters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clusters.map((cluster, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-bold text-gray-800">{cluster.clusterName}</h4>
                  <span className="text-purple-600 font-semibold">{cluster.avgMatchScore}% Match</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cluster.careers.map((career, i) => (
                    <span key={i} className="bg-white px-3 py-1 rounded-full text-sm text-gray-700 border border-purple-200">
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Individual Career Recommendations */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Career Matches</h3>
        {careers.map((career, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-800 mb-1">{career.title}</h4>
                {career.description && (
                  <p className="text-gray-600 text-sm mb-2">{career.description}</p>
                )}
                {career.cluster && (
                  <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
                    {career.cluster}
                  </span>
                )}
              </div>
              <div className="text-right ml-4">
                <div className="text-3xl font-bold text-purple-600">{career.matchScore}%</div>
                <div className="text-sm text-gray-500">Match Score</div>
              </div>
            </div>

            {/* Match Score Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-purple-600 h-3 rounded-full transition-all"
                  style={{ width: `${career.matchScore}%` }}
                />
              </div>
            </div>

            {/* Reasons */}
            {career.reasons && career.reasons.length > 0 && (
              <div>
                <h5 className="font-semibold text-gray-700 mb-2 text-sm">Why this match:</h5>
                <ul className="space-y-1">
                  {career.reasons.map((reason, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Matching Algorithm:</strong> Careers are matched based on how well your personality traits align 
          with each role's requirements. The algorithm compares your trait scores against required minimums, 
          weighting essential traits more heavily. Match scores above 70% indicate strong alignment.
        </p>
      </div>
    </div>
  );
}

export default CareerRecommendations;
