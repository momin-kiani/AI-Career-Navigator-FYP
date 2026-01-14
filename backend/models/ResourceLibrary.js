// models/ResourceLibrary.js
const mongoose = require('mongoose');

const resourceLibrarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  resourceType: {
    type: String,
    enum: ['guide', 'pdf', 'video', 'link', 'template', 'checklist'],
    required: true
  },
  category: {
    type: String,
    enum: ['resume', 'interview', 'networking', 'career-planning', 'skill-development', 'job-search', 'general'],
    default: 'general'
  },
  fileUrl: String, // For PDFs, videos, templates
  externalUrl: String, // For links
  thumbnailUrl: String,
  tags: [String],
  isInstitutionProvided: {
    type: Boolean,
    default: true
  },
  institution: String,
  author: String,
  publishedAt: {
    type: Date,
    default: Date.now
  },
  views: {
    type: Number,
    default: 0
  },
  downloads: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('ResourceLibrary', resourceLibrarySchema);
