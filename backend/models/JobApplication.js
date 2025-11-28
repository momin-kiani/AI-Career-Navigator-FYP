const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  jobUrl: String,
  jobDescription: String,
  location: String,
  salary: {
    min: Number,
    max: Number,
    currency: String
  },
  status: {
    type: String,
    enum: ['saved', 'applied', 'interviewing', 'offered', 'rejected', 'accepted', 'withdrawn'],
    default: 'saved'
  },
  appliedDate: Date,
  skillMatch: {
    score: Number,
    matchedSkills: [String],
    missingSkills: [String]
  },
  notes: String,
  contacts: [{
    name: String,
    role: String,
    email: String,
    linkedIn: String
  }],
  interviews: [{
    date: Date,
    type: String,
    notes: String,
    feedback: String
  }],
  deadline: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);