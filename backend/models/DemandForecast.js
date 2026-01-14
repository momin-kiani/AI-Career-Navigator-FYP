// models/DemandForecast.js
const mongoose = require('mongoose');

const demandForecastSchema = new mongoose.Schema({
  jobTitle: String,
  industry: String,
  region: {
    country: String,
    city: String
  },
  forecastPeriod: {
    startYear: Number,
    endYear: Number
  },
  projections: {
    year1: {
      demandScore: Number,
      expectedOpenings: Number,
      salaryProjection: Number,
      growthRate: Number
    },
    year2: {
      demandScore: Number,
      expectedOpenings: Number,
      salaryProjection: Number,
      growthRate: Number
    },
    year3: {
      demandScore: Number,
      expectedOpenings: Number,
      salaryProjection: Number,
      growthRate: Number
    },
    year4: {
      demandScore: Number,
      expectedOpenings: Number,
      salaryProjection: Number,
      growthRate: Number
    },
    year5: {
      demandScore: Number,
      expectedOpenings: Number,
      salaryProjection: Number,
      growthRate: Number
    }
  },
  methodology: {
    dataSources: [String],
    assumptions: [String],
    confidenceLevel: {
      type: Number,
      min: 0,
      max: 100
    },
    factors: [{
      factor: String,
      impact: Number,
      description: String
    }]
  },
  trends: {
    overallTrend: {
      type: String,
      enum: ['strong-growth', 'moderate-growth', 'stable', 'declining']
    },
    keyDrivers: [String],
    risks: [String],
    opportunities: [String]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
demandForecastSchema.index({ jobTitle: 1, industry: 1, 'region.country': 1 });

module.exports = mongoose.model('DemandForecast', demandForecastSchema);
