// models/JobDescription.js
const mongoose = require('mongoose');

const jobDescriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: String,
  description: {
    type: String,
    required: true
  },
  requiredSkills: [String],
  preferredSkills: [String],
  responsibilities: [String],
  qualifications: [String],
  keywords: [String], // Extracted keywords for matching
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('JobDescription', jobDescriptionSchema);
