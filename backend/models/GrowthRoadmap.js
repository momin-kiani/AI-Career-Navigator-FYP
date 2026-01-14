// models/GrowthRoadmap.js
const mongoose = require('mongoose');

const growthRoadmapSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  goal: String,
  timeframe: {
    type: String,
    enum: ['3-months', '6-months', '1-year', '2-years', '5-years'],
    default: '1-year'
  },
  milestones: [{
    milestoneId: String,
    title: String,
    description: String,
    targetDate: Date,
    status: {
      type: String,
      enum: ['not-started', 'in-progress', 'completed', 'blocked'],
      default: 'not-started'
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    tasks: [{
      taskId: String,
      title: String,
      completed: Boolean,
      dueDate: Date
    }],
    mentorFeedback: [{
      mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor'
      },
      feedback: String,
      date: Date
    }]
  }],
  skillsToDevelop: [{
    skill: String,
    priority: String,
    currentLevel: Number,
    targetLevel: Number,
    learningResources: [String]
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('GrowthRoadmap', growthRoadmapSchema);
