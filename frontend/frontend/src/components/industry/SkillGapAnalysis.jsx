// components/industry/SkillGapAnalysis.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function SkillGapAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sector, setSector] = useState('Technology');

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/industry/skills-gap', {
        params: { sector }
      });
      setAnalysis(response.data);
    } catch (error) {
      alert('Failed to analyze skill gaps: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sector) {
      fetchAnalysis();
    }
  }, [sector]);

  const getPriorityColor = (priority) => {
    const colors = {
      'critical': 'bg-red-100 text-red-700 border-red-300',
      'high': 'bg-orange-100 text-orange-700 border-orange-300',
      'medium': 'bg-yellow-100 text-yellow-700 border-yellow-300',
      'low': 'bg-blue-100 text-blue-700 border-blue-300'
    };
    return colors[priority] || colors.medium;
  };

  const getGapScoreColor = (score) => {
    if (score >= 70) return 'text-red-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-green-600';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Sector Skill Gap Analysis</h2>
        <p className="text-gray-600 mb-6">
          Compare your skills with sector requirements to identify gaps and strengths.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Sector</label>
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="Technology">Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <button
          onClick={fetchAnalysis}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Skill Gaps'}
        </button>
      </div>

      {analysis && analysis.analysis && (
        <div className="space-y-6">
          {/* Overall Gap Score */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-xl font-semibold mb-4">Overall Skill Gap Score</h3>
            <div className="text-center">
              <div className={`text-6xl font-bold mb-2 ${getGapScoreColor(analysis.analysis.overallGapScore)}`}>
                {analysis.analysis.overallGapScore}/100
              </div>
              <p className="text-lg opacity-90">
                {analysis.analysis.overallGapScore >= 70 ? 'Significant gaps identified' :
                 analysis.analysis.overallGapScore >= 40 ? 'Moderate gaps to address' :
                 'Minimal gaps - well aligned'}
              </p>
            </div>
            <div className="mt-4 w-full bg-white bg-opacity-20 rounded-full h-4">
              <div
                className="bg-white h-4 rounded-full transition-all"
                style={{ width: `${analysis.analysis.overallGapScore}%` }}
              />
            </div>
          </div>

          {/* Skill Gaps */}
          {analysis.analysis.gaps && analysis.analysis.gaps.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Identified Skill Gaps</h3>
              <div className="space-y-4">
                {analysis.analysis.gaps.map((gap, index) => (
                  <div key={index} className={`border-l-4 rounded-lg p-4 ${getPriorityColor(gap.priority)}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg mb-1">{gap.skill}</h4>
                        <p className="text-sm opacity-90">
                          Current: {gap.currentLevel}% → Required: {gap.requiredLevel}%
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white bg-opacity-50">
                          {gap.priority} priority
                        </span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Gap Size</span>
                        <span className="font-semibold">{gap.gapSize}%</span>
                      </div>
                      <div className="w-full bg-white bg-opacity-30 rounded-full h-3">
                        <div
                          className="bg-white h-3 rounded-full"
                          style={{ width: `${gap.gapSize}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-sm opacity-90">
                      Impact: <strong>{gap.impact}</strong> - {gap.gapSize}% of jobs require this skill
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Strengths */}
          {analysis.analysis.strengths && analysis.analysis.strengths.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Your Strengths</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.analysis.strengths.map((strength, index) => (
                  <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-2xl">✓</span>
                      <h4 className="font-bold text-green-800">{strength.skill}</h4>
                    </div>
                    <p className="text-sm text-green-700">{strength.advantage}</p>
                    <div className="mt-2">
                      <span className="text-xs text-green-600">Level: {strength.level}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis.analysis.recommendations && analysis.analysis.recommendations.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-4">Recommendations</h3>
              <ul className="space-y-2">
                {analysis.analysis.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start text-blue-700">
                    <span className="mr-2">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sector Required Skills */}
          {analysis.analysis.sectorRequiredSkills && analysis.analysis.sectorRequiredSkills.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Required Skills in {sector}</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.analysis.sectorRequiredSkills.slice(0, 15).map((skill, index) => {
                  const hasSkill = analysis.analysis.userSkills.some(us => 
                    us.toLowerCase().includes(skill.skill.toLowerCase())
                  );
                  return (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        hasSkill
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {skill.skill} ({skill.frequency}%)
                      {hasSkill && ' ✓'}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SkillGapAnalysis;
