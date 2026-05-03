const ChatRoom = require('../models/ChatRoom');

const getChatRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ participants: req.user._id }).populate('participants', 'firstName lastName role avatarUrl');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load chat rooms' });
  }
};

const createChatRoom = async (req, res) => {
  try {
    const participants = req.body.participants || [req.user._id];
    if (!participants.includes(req.user._id.toString())) {
      participants.push(req.user._id.toString());
    }
    const room = await ChatRoom.create({ participants, title: req.body.title || 'New conversation' });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create chat room' });
  }
};

module.exports = { getChatRooms, createChatRoom };
