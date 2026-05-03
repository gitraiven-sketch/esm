const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  pinned: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, enum: ['admin', 'employee', 'all'], default: 'all' }
}, { timestamps: true });

module.exports = mongoose.model('Announcement', AnnouncementSchema);
