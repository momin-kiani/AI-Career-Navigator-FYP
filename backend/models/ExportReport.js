// models/ExportReport.js
const mongoose = require('mongoose');

const exportReportSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportType: {
    type: String,
    enum: ['skill-gap', 'education', 'demand-trends', 'employer-strategy', 'comprehensive'],
    required: true
  },
  sector: String,
  format: {
    type: String,
    enum: ['pdf', 'csv', 'json'],
    default: 'pdf'
  },
  filePath: String,
  fileUrl: String,
  metadata: {
    generatedAt: Date,
    dataRange: {
      startDate: Date,
      endDate: Date
    },
    sections: [String],
    pageCount: Number
  },
  status: {
    type: String,
    enum: ['pending', 'generating', 'completed', 'failed'],
    default: 'pending'
  },
  error: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
exportReportSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ExportReport', exportReportSchema);
