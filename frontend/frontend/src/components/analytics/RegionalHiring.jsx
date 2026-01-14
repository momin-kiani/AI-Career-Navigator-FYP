// components/analytics/RegionalHiring.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function RegionalHiring() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    region: '',
    industry: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.region) params.region = filters.region;
      if (filters.industry) params.industry = filters.industry;

      const response = await axios.get('/analytics/regional', { params });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching regional data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getHealthColor = (health) => {
    const colors = {
      'excellent': 'bg-green-100 text-green-700',
      'good': 'bg-blue-100 text-blue-700',
      'moderate': 'bg-yellow-100 text-yellow-700',
      'poor': 'bg-red-100 text-red-700'
    };
    return colors[health] || colors.moderate;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Regional Hiring Strategy</h2>
        <p className="text-gray-600 mb-6">
          Analyze hiring patterns, trends, and market health by region.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
            <input
              type="text"
              value={filters.region}
              onChange={(e) => setFilters({...filters, region: e.target.value})}
              placeholder="e.g., San Francisco, USA, or 'all'"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
            <select
              value={filters.industry}
              onChange={(e) => setFilters({...filters, industry: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Industries</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchData}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Analyzing...' : 'Analyze Region'}
        </button>
      </div>

      {data && data.statistics && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Total Openings</h3>
              <p className="text-3xl font-bold">{data.statistics.totalOpenings}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">New Postings</h3>
              <p className="text-3xl font-bold">{data.statistics.newPostings}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Avg. Salary</h3>
              <p className="text-3xl font-bold">${data.statistics.averageSalary?.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Hiring Rate</h3>
              <p className="text-3xl font-bold">{data.statistics.hiringRate}%</p>
            </div>
          </div>

          {/* Market Health */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Market Health</h3>
            <div className="flex items-center space-x-4">
              <span className={`px-4 py-2 rounded-lg font-semibold ${getHealthColor(data.trends?.marketHealth)}`}>
                {data.trends?.marketHealth?.toUpperCase()}
              </span>
              <div>
                <p className="text-sm text-gray-600">
                  Growth Direction: <strong>{data.trends?.growthDirection}</strong>
                </p>
                <p className="text-sm text-gray-600">
                  Growth Rate: <strong>{data.trends?.growthRate}%</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Top Companies */}
          {data.statistics.topCompanies && data.statistics.topCompanies.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Companies</h3>
              <div className="space-y-3">
                {data.statistics.topCompanies.map((company, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <span className="font-semibold text-gray-800">{company.company}</span>
                    <span className="text-blue-600 font-bold">{company.openings} openings</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Roles */}
          {data.statistics.topRoles && data.statistics.topRoles.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Roles</h3>
              <div className="space-y-3">
                {data.statistics.topRoles.map((role, index) => (
                  <div key={index} className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <div>
                      <span className="font-semibold text-gray-800">{role.role}</span>
                      <p className="text-sm text-gray-500">{role.count} positions</p>
                    </div>
                    <span className="text-green-600 font-bold">
                      ${role.avgSalary?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default RegionalHiring;
