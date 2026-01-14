// models/AIQuestionTemplate.js
const mongoose = require('mongoose');

const aiQuestionTemplateSchema = new mongoose.Schema({
  field: {
    type: String,
    enum: ['Frontend', 'Backend', 'Web3', 'DevOps', 'Full-Stack', 'Mobile', 'Data Science', 'AI/ML', 'Cybersecurity', 'Cloud'],
    required: true
  },
  topic: String,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  questionType: {
    type: String,
    enum: ['multiple-choice', 'true-false', 'coding', 'short-answer'],
    default: 'multiple-choice'
  },
  template: {
    questionPattern: String,
    optionsPattern: String,
    explanationPattern: String
  },
  examples: [{
    question: String,
    options: [String],
    correctAnswer: String,
    explanation: String
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AIQuestionTemplate', aiQuestionTemplateSchema);
