// models/EmploymentOutcome.js
const mongoose = require('mongoose');

const employmentOutcomeSchema = new mongoose.Schema({
  region: {
    city: String,
    state: String,
    country: String
  },
  industry: String,
  period: {
    startDate: Date,
    endDate: Date,
    type: {
      type: String,
      enum: ['monthly', 'quarterly', 'yearly']
    }
  },
  outcomes: {
    employmentRate: Number, // Percentage
    unemploymentRate: Number, // Percentage
    underemploymentRate: Number, // Percentage
    averageTimeToEmployment: Number, // Days
    jobGrowthRate: Number, // Percentage
    retentionRate: Number, // Percentage
    careerProgressionRate: Number // Percentage
  },
  byRole: [{
    role: String,
    employmentRate: Number,
    averageSalary: Number,
    growthRate: Number
  }],
  byExperience: [{
    level: String,
    employmentRate: Number,
    averageTimeToEmployment: Number
  }],
  trends: {
    direction: {
      type: String,
      enum: ['improving', 'declining', 'stable']
    },
    keyFactors: [String],
    projections: {
      nextQuarter: Number,
      nextYear: Number
    }
  },
  insights: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
employmentOutcomeSchema.index({ 'region.city': 1, industry: 1, 'period.endDate': -1 });

module.exports = mongoose.model('EmploymentOutcome', employmentOutcomeSchema);
