// models/Question.js
const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  testId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test'
  },
  questionText: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'coding', 'short-answer'],
    default: 'multiple-choice'
  },
  options: [{
    text: String,
    isCorrect: {
      type: Boolean,
      default: false
    }
  }],
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed // Can be string, number, or array
  },
  explanation: String,
  marks: {
    type: Number,
    default: 1
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  topic: String,
  field: {
    type: String,
    enum: ['Frontend', 'Backend', 'Web3', 'DevOps', 'Full-Stack', 'Mobile', 'Data Science', 'AI/ML', 'Cybersecurity', 'Cloud']
  },
  isAIGenerated: {
    type: Boolean,
    default: false
  },
  aiTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AIQuestionTemplate'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Question', questionSchema);
