// models/EmployerStrategy.js
const mongoose = require('mongoose');

const employerStrategySchema = new mongoose.Schema({
  sector: {
    type: String,
    required: true
  },
  region: {
    country: String,
    city: String
  },
  strategies: [{
    category: {
      type: String,
      enum: ['hiring', 'retention', 'skill-development', 'compensation', 'workplace-culture']
    },
    title: String,
    description: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    impact: {
      type: String,
      enum: ['high', 'medium', 'low']
    },
    implementation: {
      steps: [String],
      timeline: String,
      resources: [String],
      estimatedCost: {
        amount: Number,
        currency: String
      }
    },
    successMetrics: [String],
    examples: [String]
  }],
  insights: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
employerStrategySchema.index({ sector: 1, 'region.country': 1 });

module.exports = mongoose.model('EmployerStrategy', employerStrategySchema);
