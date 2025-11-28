const mongoose = require('mongoose');

const careerAssessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessmentType: {
    type: String,
    enum: ['personality', 'skills', 'interests', 'values']
  },
  responses: [{
    questionId: String,
    question: String,
    answer: mongoose.Schema.Types.Mixed
  }],
  results: {
    personalityType: String,
    traits: [{
      name: String,
      score: Number
    }],
    recommendedCareers: [{
      title: String,
      matchScore: Number,
      reasons: [String]
    }],
    skillGaps: [{
      skill: String,
      currentLevel: Number,
      requiredLevel: Number,
      priority: String
    }]
  },
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('CareerAssessment', careerAssessmentSchema);