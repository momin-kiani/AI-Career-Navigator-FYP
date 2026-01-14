// models/RegionalTrainingProgram.js
const mongoose = require('mongoose');

const regionalTrainingProgramSchema = new mongoose.Schema({
  region: {
    city: String,
    state: String,
    country: String
  },
  program: {
    title: String,
    provider: String,
    type: {
      type: String,
      enum: ['bootcamp', 'certification', 'apprenticeship', 'workshop', 'degree-program', 'online-course']
    },
    duration: String,
    format: {
      type: String,
      enum: ['in-person', 'online', 'hybrid']
    },
    cost: {
      amount: Number,
      currency: String,
      financialAid: Boolean
    },
    skillsCovered: [String],
    industryFocus: [String],
    jobPlacementRate: Number, // Percentage
    averageSalaryAfter: Number,
    prerequisites: [String],
    url: String,
    contact: {
      email: String,
      phone: String,
      address: String
    }
  },
  demandAlignment: {
    score: Number, // 0-100
    inDemandSkills: [String],
    localJobOpportunities: Number
  },
  successMetrics: {
    completionRate: Number,
    employmentRate: Number,
    averageTimeToEmployment: Number,
    salaryIncrease: Number // Percentage
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: Date
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
regionalTrainingProgramSchema.index({ 'region.city': 1, 'program.industryFocus': 1 });

module.exports = mongoose.model('RegionalTrainingProgram', regionalTrainingProgramSchema);
