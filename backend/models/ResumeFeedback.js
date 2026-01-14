// models/ResumeFeedback.js
const mongoose = require('mongoose');

const resumeFeedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resumeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume'
  },
  feedback: {
    overallScore: {
      type: Number,
      min: 0,
      max: 100
    },
    strengths: [String],
    weaknesses: [String],
    suggestions: [{
      category: String,
      suggestion: String,
      priority: {
        type: String,
        enum: ['low', 'medium', 'high']
      }
    }],
    improvements: [String],
    keywordAnalysis: {
      found: [String],
      missing: [String],
      recommendations: [String]
    }
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ResumeFeedback', resumeFeedbackSchema);
