// components/regional/SalaryBenchmarking.jsx
import React, { useState, useEffect } from 'react';
import axios from '../../services/api';

function SalaryBenchmarking() {
  const [benchmarkData, setBenchmarkData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: 'San Francisco',
    role: '',
    industry: '',
    experienceLevel: ''
  });

  const fetchBenchmarkData = async () => {
    setLoading(true);
    try {
      const params = { city: filters.city };
      if (filters.role) params.role = filters.role;
      if (filters.industry) params.industry = filters.industry;
      if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;

      const response = await axios.get('/regional/salary', { params });
      setBenchmarkData(response.data);
    } catch (error) {
      if (error.response?.status === 404) {
        alert('Insufficient salary data for this region/role combination');
      } else {
        alert('Failed to fetch salary benchmarks: ' + (error.response?.data?.error || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (filters.city) {
      fetchBenchmarkData();
    }
  }, [filters.city]);

  const getTrendColor = (direction) => {
    const colors = {
      'increasing': 'text-green-600',
      'decreasing': 'text-red-600',
      'stable': 'text-gray-600'
    };
    return colors[direction] || colors.stable;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Salary Benchmarking</h2>
        <p className="text-gray-600 mb-6">
          Compare salary benchmarks by role, experience level, and location.
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <input
              type="text"
              value={filters.role}
              onChange={(e) => setFilters({...filters, role: e.target.value})}
              placeholder="e.g., Software Engineer"
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
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
            <select
              value={filters.experienceLevel}
              onChange={(e) => setFilters({...filters, experienceLevel: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Auto-detect</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
              <option value="executive">Executive</option>
            </select>
          </div>
        </div>

        <button
          onClick={fetchBenchmarkData}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Get Benchmarks'}
        </button>
      </div>

      {benchmarkData && benchmarkData.benchmarks && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Median (50th)</h3>
              <p className="text-3xl font-bold">${benchmarkData.benchmarks.percentile50?.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">Average</h3>
              <p className="text-3xl font-bold">${benchmarkData.benchmarks.average?.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">75th Percentile</h3>
              <p className="text-3xl font-bold">${benchmarkData.benchmarks.percentile75?.toLocaleString()}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-md p-6 text-white">
              <h3 className="text-sm font-semibold mb-2 opacity-90">90th Percentile</h3>
              <p className="text-3xl font-bold">${benchmarkData.benchmarks.percentile90?.toLocaleString()}</p>
            </div>
          </div>

          {/* Salary Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Salary Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>25th Percentile</span>
                  <span className="font-semibold">${benchmarkData.benchmarks.percentile25?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-500 h-3 rounded-full"
                    style={{ width: '25%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>50th Percentile (Median)</span>
                  <span className="font-semibold">${benchmarkData.benchmarks.percentile50?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: '50%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>75th Percentile</span>
                  <span className="font-semibold">${benchmarkData.benchmarks.percentile75?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-purple-500 h-3 rounded-full"
                    style={{ width: '75%' }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>90th Percentile</span>
                  <span className="font-semibold">${benchmarkData.benchmarks.percentile90?.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-orange-500 h-3 rounded-full"
                    style={{ width: '90%' }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Range</p>
                <p className="text-lg font-semibold text-gray-800">
                  ${benchmarkData.benchmarks.min?.toLocaleString()} - ${benchmarkData.benchmarks.max?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Sample Size</p>
                <p className="text-lg font-semibold text-gray-800">{benchmarkData.sampleSize} jobs</p>
              </div>
            </div>
          </div>

          {/* Trends */}
          {benchmarkData.trends && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Salary Trends</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Year-over-Year</p>
                  <p className={`text-2xl font-bold ${getTrendColor(benchmarkData.trends.direction)}`}>
                    {benchmarkData.trends.yearOverYear >= 0 ? '+' : ''}{benchmarkData.trends.yearOverYear}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">6-Month Change</p>
                  <p className={`text-2xl font-bold ${getTrendColor(benchmarkData.trends.direction)}`}>
                    {benchmarkData.trends.sixMonth >= 0 ? '+' : ''}{benchmarkData.trends.sixMonth}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Direction</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {benchmarkData.trends.direction}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cost of Living */}
          {benchmarkData.costOfLiving && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Cost of Living Adjustment</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Cost of Living Index</p>
                  <p className="text-2xl font-bold text-gray-800">{benchmarkData.costOfLiving.index}/100</p>
                  <p className="text-xs text-gray-500 mt-1">100 = National Average</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Adjusted Salary</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ${benchmarkData.costOfLiving.adjustedSalary?.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Cost-of-living adjusted</p>
                </div>
              </div>
            </div>
          )}

          {/* Data Quality */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Data Quality</span>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                benchmarkData.dataQuality === 'high' ? 'bg-green-100 text-green-700' :
                benchmarkData.dataQuality === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {benchmarkData.dataQuality}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SalaryBenchmarking;
