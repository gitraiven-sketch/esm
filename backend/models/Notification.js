const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  link: { type: String, default: '' },
  read: { type: Boolean, default: false },
  type: { type: String, enum: ['announcement', 'leave', 'attendance', 'chat', 'contract'], default: 'announcement' }
}, { timestamps: true });

module.exports = mongoose.model('Notification', NotificationSchema);
