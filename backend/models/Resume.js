const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fileName: String,
  fileUrl: String,
  atsScore: {
    type: Number,
    min: 0,
    max: 100
  },
  analysis: {
    keywords: [String],
    missingKeywords: [String],
    suggestions: [String],
    strengths: [String],
    weaknesses: [String]
  },
  content: {
    rawText: String,
    sections: {
      summary: String,
      experience: [{
        company: String,
        position: String,
        duration: String,
        description: String
      }],
      education: [{
        institution: String,
        degree: String,
        field: String,
        graduationDate: Date
      }],
      skills: [String],
      certifications: [{
        name: String,
        issuer: String,
        date: Date
      }]
    }
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  },
  lastModified: Date
});

module.exports = mongoose.model('Resume', resumeSchema);