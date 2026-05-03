const mongoose = require('mongoose');

const LeaveRequestSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['paid', 'sick', 'unpaid'], default: 'paid' },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminComment: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('LeaveRequest', LeaveRequestSchema);
