const mongoose = require('mongoose');

const WorkReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  summary: { type: String, required: true },
  status: { type: String, enum: ['draft', 'submitted', 'reviewed'], default: 'submitted' },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('WorkReport', WorkReportSchema);
