// components/assessment/AssessmentResults.jsx
import React from 'react';
import PersonalityProfile from './PersonalityProfile';
import CareerRecommendations from './CareerRecommendations';
import SkillGapAnalysis from './SkillGapAnalysis';
import CareerPathVisualization from './CareerPathVisualization';

function AssessmentResults({ assessment, onBack, onRetake }) {
  if (!assessment || !assessment.results) {
    return (
      <div className="p-8">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <p className="text-gray-600">No assessment results available</p>
          <button
            onClick={onBack}
            className="mt-4 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const results = assessment.results;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Assessment Results</h1>
          <p className="text-gray-600 mt-1">
            Completed {new Date(assessment.completedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={onRetake}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
          >
            Retake Assessment
          </button>
          <button
            onClick={onBack}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Back to Assessments
          </button>
        </div>
      </div>

      {/* Personality Type Summary */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{results.personalityType}</h2>
            <p className="text-purple-100 text-lg mb-4">{results.personalityDescription}</p>
            <div className="flex items-center space-x-4">
              <div>
                <span className="text-sm text-purple-200">Confidence Score</span>
                <div className="text-3xl font-bold">{results.confidence}%</div>
              </div>
            </div>
          </div>
          <div className="text-6xl">🎯</div>
        </div>
      </div>

      {/* Personality Profile */}
      {results.traits && results.traits.length > 0 && (
        <div className="mb-8">
          <PersonalityProfile traits={results.traits} />
        </div>
      )}

      {/* Career Recommendations */}
      {results.recommendedCareers && results.recommendedCareers.length > 0 && (
        <div className="mb-8">
          <CareerRecommendations careers={results.recommendedCareers} clusters={results.careerClusters} />
        </div>
      )}

      {/* Career Path Visualization */}
      {results.careerClusters && results.careerClusters.length > 0 && (
        <div className="mb-8">
          <CareerPathVisualization clusters={results.careerClusters} />
        </div>
      )}

      {/* Skill Gap Analysis */}
      {results.skillGaps && results.skillGaps.length > 0 && (
        <div className="mb-8">
          <SkillGapAnalysis skillGaps={results.skillGaps} />
        </div>
      )}
    </div>
  );
}

export default AssessmentResults;
