// components/assessment/SkillGapAnalysis.jsx
import React from 'react';

function SkillGapAnalysis({ skillGaps }) {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-blue-100 border-blue-300 text-blue-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'High Priority';
      case 'medium': return 'Medium Priority';
      case 'low': return 'Low Priority';
      default: return 'Priority';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Skill Gap Analysis</h2>
      <p className="text-gray-600 mb-6">
        Skills where you may need development to excel in your recommended careers. Priority is based on the gap size and career importance.
      </p>

      <div className="space-y-4">
        {skillGaps.map((gap, index) => {
          const percentage = Math.round((gap.currentLevel / gap.requiredLevel) * 100);
          const gapSize = gap.requiredLevel - gap.currentLevel;

          return (
            <div key={index} className={`border-2 rounded-lg p-4 ${getPriorityColor(gap.priority)}`}>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h4 className="font-bold text-gray-800 mb-1">{gap.skill}</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    <span>
                      Current: <strong>{gap.currentLevel}/100</strong>
                    </span>
                    <span>
                      Required: <strong>{gap.requiredLevel}/100</strong>
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(gap.priority)}`}>
                      {getPriorityLabel(gap.priority)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{gapSize} points</div>
                  <div className="text-sm">Gap</div>
                </div>
              </div>

              <div className="mb-2">
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Current Level</span>
                  <span>Required Level</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 relative">
                  <div
                    className="bg-blue-500 h-4 rounded-l-full"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                  <div
                    className="absolute bg-red-500 h-4 rounded-r-full opacity-50"
                    style={{ 
                      left: `${percentage}%`,
                      width: `${Math.min(100 - percentage, (gapSize / gap.requiredLevel) * 100)}%` 
                    }}
                  />
                </div>
              </div>

              <div className="mt-3 text-sm">
                <strong>Recommendation:</strong> Focus on developing {gap.skill} to improve your match with recommended careers. 
                {gap.priority === 'high' && ' This is a high-priority skill gap that significantly impacts your career fit.'}
                {gap.priority === 'medium' && ' This skill would enhance your career prospects in several recommended roles.'}
                {gap.priority === 'low' && ' This is a minor gap that could provide additional career advantages.'}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Skill Gap Calculation:</strong> Gaps are identified by comparing your current trait scores with 
          the minimum requirements for recommended careers. Priority is assigned based on gap size (high: &gt;30 points, 
          medium: 15-30 points, low: &lt;15 points) and the importance of the skill to your top career matches.
        </p>
      </div>
    </div>
  );
}

export default SkillGapAnalysis;
