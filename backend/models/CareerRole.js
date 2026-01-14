// models/CareerRole.js
const mongoose = require('mongoose');

const careerRoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  industry: String,
  cluster: {
    type: String,
    required: true
    // Career clusters: Technology, Business, Creative, Healthcare, Education, etc.
  },
  requiredTraits: [{
    trait: String,
    minScore: Number, // 0-100
    weight: Number
  }],
  requiredSkills: [{
    skill: String,
    importance: {
      type: String,
      enum: ['essential', 'important', 'preferred'],
      default: 'important'
    }
  }],
  salaryRange: {
    min: Number,
    max: Number,
    currency: String
  },
  growthProjection: Number, // Percentage
  demandScore: Number // 0-100
});

module.exports = mongoose.model('CareerRole', careerRoleSchema);
