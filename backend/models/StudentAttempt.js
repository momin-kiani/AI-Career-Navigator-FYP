// models/StudentAttempt.js
const mongoose = require('mongoose');

const studentAttemptSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question'
    },
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    marksObtained: Number,
    timeSpent: Number // in seconds
  }],
  score: {
    obtained: Number,
    total: Number,
    percentage: Number
  },
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'submitted', 'expired'],
    default: 'in-progress'
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  submittedAt: Date,
  timeRemaining: Number, // in seconds
  isPassed: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
studentAttemptSchema.index({ studentId: 1, testId: 1 });
studentAttemptSchema.index({ studentId: 1, createdAt: -1 });

module.exports = mongoose.model('StudentAttempt', studentAttemptSchema);
