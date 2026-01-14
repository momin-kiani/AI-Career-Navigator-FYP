// models/SkillGap.js
const mongoose = require('mongoose');

const skillGapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  analysis: {
    userSkills: [String],
    sectorRequiredSkills: [{
      skill: String,
      frequency: Number,
      importance: String
    }],
    gaps: [{
      skill: String,
      currentLevel: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      requiredLevel: {
        type: Number,
        min: 0,
        max: 100
      },
      gapSize: {
        type: Number,
        min: 0,
        max: 100
      },
      priority: {
        type: String,
        enum: ['critical', 'high', 'medium', 'low']
      },
      impact: {
        type: String,
        enum: ['high', 'medium', 'low']
      }
    }],
    strengths: [{
      skill: String,
      level: Number,
      advantage: String
    }],
    overallGapScore: {
      type: Number,
      min: 0,
      max: 100
    },
    recommendations: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
skillGapSchema.index({ userId: 1, sector: 1 });

module.exports = mongoose.model('SkillGap', skillGapSchema);
