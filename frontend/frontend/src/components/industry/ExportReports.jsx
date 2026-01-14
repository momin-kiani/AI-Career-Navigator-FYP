// components/industry/ExportReports.jsx
import React, { useState } from 'react';
import axios from '../../services/api';

function ExportReports() {
  const [sector, setSector] = useState('Technology');
  const [format, setFormat] = useState('json');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/industry/export-report', {
        params: { sector, format }
      });
      setReport(response.data);
    } catch (error) {
      alert('Failed to generate report: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = async (exportId) => {
    try {
      const response = await axios.get(`/industry/export-report/${exportId}/download`);
      alert('Report ready for download! In production, this would download the file.');
    } catch (error) {
      alert('Failed to download report');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Export Sector Reports</h2>
        <p className="text-gray-600 mb-6">
          Generate comprehensive industry insights reports in various formats.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
              <option value="pdf">PDF (Coming Soon)</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateReport}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Generating Report...' : 'Generate Report'}
        </button>
      </div>

      {report && report.report && (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">Industry Insights Report</h3>
            <p className="text-lg opacity-90">{report.report.sector} Sector</p>
            <p className="text-sm opacity-75 mt-2">
              Generated: {new Date(report.report.generatedAt).toLocaleString()}
            </p>
          </div>

          {/* Executive Summary */}
          {report.report.sections.executiveSummary && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {report.report.sections.executiveSummary.title}
              </h3>
              <p className="text-gray-700">{report.report.sections.executiveSummary.content}</p>
            </div>
          )}

          {/* Skill Gap Analysis */}
          {report.report.sections.skillGapAnalysis && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {report.report.sections.skillGapAnalysis.title}
              </h3>
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-700">
                  Overall Gap Score: <span className="text-blue-600">{report.report.sections.skillGapAnalysis.overallGapScore}/100</span>
                </p>
              </div>
              {report.report.sections.skillGapAnalysis.criticalGaps && report.report.sections.skillGapAnalysis.criticalGaps.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Critical Gaps:</h4>
                  <ul className="space-y-2">
                    {report.report.sections.skillGapAnalysis.criticalGaps.map((gap, i) => (
                      <li key={i} className="text-gray-600">
                        • {gap.skill} (Gap: {gap.gapSize}%, Priority: {gap.priority})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.report.sections.skillGapAnalysis.strengths && report.report.sections.skillGapAnalysis.strengths.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Strengths:</h4>
                  <ul className="space-y-2">
                    {report.report.sections.skillGapAnalysis.strengths.map((strength, i) => (
                      <li key={i} className="text-gray-600">
                        ✓ {strength.skill} - {strength.advantage}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Education Recommendations */}
          {report.report.sections.educationRecommendations && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {report.report.sections.educationRecommendations.title}
              </h3>
              <p className="text-gray-600 mb-4">
                Total Recommendations: {report.report.sections.educationRecommendations.totalRecommendations}
              </p>
              {report.report.sections.educationRecommendations.topRecommendations && (
                <div className="space-y-3">
                  {report.report.sections.educationRecommendations.topRecommendations.map((rec, i) => (
                    <div key={i} className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                      <p className="text-sm text-gray-600">{rec.provider} • {rec.duration}</p>
                      <p className="text-sm text-gray-500">Relevance: {rec.relevanceScore}%</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Demand Trends */}
          {report.report.sections.demandTrends && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {report.report.sections.demandTrends.title}
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Growth Rate</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {report.report.sections.demandTrends.growthRate}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Forecast</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {report.report.sections.demandTrends.forecast?.replace('-', ' ')}
                  </p>
                </div>
              </div>
              {report.report.sections.demandTrends.emergingSkills && report.report.sections.demandTrends.emergingSkills.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Emerging Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.report.sections.demandTrends.emergingSkills.map((skill, i) => (
                      <span key={i} className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                        {skill.skill} (+{Math.round(skill.growth)}%)
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Employer Strategies */}
          {report.report.sections.employerStrategies && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {report.report.sections.employerStrategies.title}
              </h3>
              <p className="text-gray-600 mb-4">
                Total Strategies: {report.report.sections.employerStrategies.strategies?.length || 0}
              </p>
              {report.report.sections.employerStrategies.priorityActions && report.report.sections.employerStrategies.priorityActions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2">Priority Actions:</h4>
                  <ul className="space-y-2">
                    {report.report.sections.employerStrategies.priorityActions.map((action, i) => (
                      <li key={i} className="text-gray-600">
                        • {action.title} ({action.category})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Download Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Download Report</h3>
            <div className="flex items-center space-x-4">
              <p className="text-gray-600">Report ID: {report.exportId}</p>
              <button
                onClick={() => downloadReport(report.exportId)}
                className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Download {format.toUpperCase()}
              </button>
            </div>
            {format === 'json' && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify(report.report, null, 2);
                    const dataBlob = new Blob([dataStr], { type: 'application/json' });
                    const url = URL.createObjectURL(dataBlob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `industry-report-${sector}.json`;
                    link.click();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
                >
                  Download JSON File
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ExportReports;
