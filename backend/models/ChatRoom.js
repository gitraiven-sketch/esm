const mongoose = require('mongoose');

const ChatRoomSchema = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  title: { type: String, default: 'Team Chat' },
  lastMessage: { type: String, default: '' },
  unreadCounts: { type: Map, of: Number, default: {} }
}, { timestamps: true });

module.exports = mongoose.model('ChatRoom', ChatRoomSchema);
