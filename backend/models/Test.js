// models/Test.js
const mongoose = require('mongoose');

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  field: {
    type: String,
    enum: ['Frontend', 'Backend', 'Web3', 'DevOps', 'Full-Stack', 'Mobile', 'Data Science', 'AI/ML', 'Cybersecurity', 'Cloud'],
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  totalQuestions: {
    type: Number,
    default: 0
  },
  totalMarks: {
    type: Number,
    default: 0
  },
  passingScore: {
    type: Number,
    default: 60 // Percentage
  },
  duration: {
    type: Number, // in minutes
    default: null // null means no timer
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  instructions: String,
  tags: [String],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'intermediate'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('Test', testSchema);
