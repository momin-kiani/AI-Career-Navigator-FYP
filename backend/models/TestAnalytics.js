// models/TestAnalytics.js
const mongoose = require('mongoose');

const testAnalyticsSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  totalAttempts: {
    type: Number,
    default: 0
  },
  totalStudents: {
    type: Number,
    default: 0
  },
  averageScore: {
    type: Number,
    default: 0
  },
  passRate: {
    type: Number,
    default: 0 // Percentage
  },
  averageTimeSpent: {
    type: Number,
    default: 0 // in minutes
  },
  scoreDistribution: {
    excellent: Number, // 90-100
    good: Number, // 80-89
    average: Number, // 70-79
    belowAverage: Number, // 60-69
    fail: Number // <60
  },
  questionPerformance: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    correctAttempts: Number,
    incorrectAttempts: Number,
    averageTimeSpent: Number,
    difficultyRating: Number // 0-100
  }],
  fieldPerformance: {
    field: String,
    averageScore: Number,
    totalAttempts: Number
  },
  trends: {
    weekly: [{
      week: String,
      averageScore: Number,
      attempts: Number
    }],
    monthly: [{
      month: String,
      averageScore: Number,
      attempts: Number
    }]
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TestAnalytics', testAnalyticsSchema);
