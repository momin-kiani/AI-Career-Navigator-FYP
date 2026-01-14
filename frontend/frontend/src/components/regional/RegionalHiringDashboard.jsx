// components/regional/RegionalHiringDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function RegionalHiringDashboard() {
  const [hiringData, setHiringData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: 'San Francisco',
    region: '',
    country: '',
    industry: ''
  });

  const fetchHiringData = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.city) params.city = filters.city;
      if (filters.region) params.region = filters.region;
      if (filters.country) params.country = filters.country;
      if (filters.industry) params.industry = filters.industry;

      const response = await axios.get('/regional/hiring', { params });
      setHiringData(response.data);
    } catch (error) {
      alert('Failed to fetch hiring data: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.city || filters.region || filters.country) {
      fetchHiringData();
    }
  }, [filters.city, filters.region, filters.country]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Regional Hiring Dashboard</h2>
        <p className="text-gray-600 mb-6">
          View hiring data and trends for specific cities and regions.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({...filters, city: e.target.value})}
              placeholder="e.g., San Francisco"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Region/State</label>
            <input
              type="text"
              value={filters.region}
              onChange={(e) => setFilters({...filters, region: e.target.value})}
              placeholder="e.g., California"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            <input
              type="text"
              value={filters.country}
              onChange={(e) => setFilters({...filters, country: e.target.value})}
              placeholder="e.g., USA"
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
            </select>
          </div>
        </div>

        <button
          onClick={fetchHiringData}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh Data'}
        </button>
      </div>

      {hiringData && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Total Openings</h3>
              <p className="text-3xl font-bold">{hiringData.totalOpenings}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Recent Openings</h3>
              <p className="text-3xl font-bold">{hiringData.recentOpenings}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Growth Rate</h3>
              <p className="text-3xl font-bold">
                {hiringData.growthRate >= 0 ? '+' : ''}{hiringData.growthRate}%
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Location</h3>
              <p className="text-lg font-bold">
                {hiringData.location.city || hiringData.location.region || hiringData.location.country || 'N/A'}
              </p>
            </div>
          </div>

          {/* Top Companies */}
          {hiringData.topCompanies && hiringData.topCompanies.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Companies</h3>
              <div className="space-y-3">
                {hiringData.topCompanies.map((company, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-gray-800">{company.company}</h4>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-blue-600">{company.openings}</p>
                      <p className="text-xs text-gray-500">openings</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Top Roles */}
          {hiringData.topRoles && hiringData.topRoles.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Top Roles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hiringData.topRoles.map((role, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                    <h4 className="font-semibold text-gray-800">{role.role}</h4>
                    <p className="text-sm text-gray-600">{role.count} openings</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Industries */}
          {hiringData.industries && hiringData.industries.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Industry Distribution</h3>
              <div className="space-y-2">
                {hiringData.industries.map((ind, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-700">{ind.industry}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(ind.count / hiringData.totalOpenings) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-600 w-12 text-right">{ind.count}</span>
                    </div>
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

export default RegionalHiringDashboard;
