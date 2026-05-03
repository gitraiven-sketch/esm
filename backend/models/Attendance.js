const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  checkIn: { type: String },
  checkOut: { type: String },
  status: { type: String, enum: ['present', 'absent', 'late', 'sick', 'on-leave'], default: 'present' },
  late: { type: Boolean, default: false },
  note: { type: String, default: '' }
}, { timestamps: true });

AttendanceSchema.index({ user: 1, date: 1 }, { unique: true });
module.exports = mongoose.model('Attendance', AttendanceSchema);
