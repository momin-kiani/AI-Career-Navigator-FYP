// models/SalaryBenchmark.js
const mongoose = require('mongoose');

const salaryBenchmarkSchema = new mongoose.Schema({
  region: {
    city: String,
    state: String,
    country: String,
    regionCode: String
  },
  role: String,
  industry: String,
  experienceLevel: {
    type: String,
    enum: ['entry', 'mid', 'senior', 'executive']
  },
  benchmarks: {
    percentile25: Number,
    percentile50: Number, // Median
    percentile75: Number,
    percentile90: Number,
    average: Number,
    min: Number,
    max: Number
  },
  currency: {
    type: String,
    default: 'USD'
  },
  sampleSize: Number,
  dataQuality: {
    type: String,
    enum: ['high', 'medium', 'low']
  },
  trends: {
    yearOverYear: Number, // Percentage change
    sixMonth: Number,
    direction: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable']
    }
  },
  costOfLiving: {
    index: Number, // 0-100, where 100 is average
    adjustedSalary: Number // Salary adjusted for cost of living
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
salaryBenchmarkSchema.index({ 'region.city': 1, role: 1, industry: 1, experienceLevel: 1 });

module.exports = mongoose.model('SalaryBenchmark', salaryBenchmarkSchema);
