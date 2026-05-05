const ChatRoom = require('../models/ChatRoom');
const Message = require('../models/Message');
const User = require('../models/User');

const getChatRooms = async (req, res) => {
  try {
    const rooms = await ChatRoom.find({ participants: req.user._id })
      .populate('participants', 'firstName lastName role avatarUrl')
      .sort({ updatedAt: -1 });
    res.json(rooms);
  } catch (error) {
    console.error('Error fetching chat rooms:', error);
    res.status(500).json({ message: 'Unable to load chat rooms' });
  }
};

const createChatRoom = async (req, res) => {
  try {
    const { participants, title } = req.body;
    const participantIds = participants ? participants.map(id => id.toString()) : [req.user._id.toString()];

    if (!participantIds.includes(req.user._id.toString())) {
      participantIds.push(req.user._id.toString());
    }

    // Check if room already exists with same participants
    const existingRoom = await ChatRoom.findOne({
      participants: { $all: participantIds, $size: participantIds.length }
    });

    if (existingRoom) {
      const populatedRoom = await ChatRoom.findById(existingRoom._id).populate('participants', 'firstName lastName role avatarUrl');
      return res.json(populatedRoom);
    }

    const room = await ChatRoom.create({
      participants: participantIds,
      title: title || 'New conversation'
    });

    const populatedRoom = await ChatRoom.findById(room._id).populate('participants', 'firstName lastName role avatarUrl');
    res.json(populatedRoom);
  } catch (error) {
    console.error('Error creating chat room:', error);
    res.status(500).json({ message: 'Unable to create chat room' });
  }
};

const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Verify user is participant in the room
    const room = await ChatRoom.findById(roomId);
    if (!room || !room.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const messages = await Message.find({ chatRoom: roomId })
      .populate('sender', 'firstName lastName avatarUrl')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Mark messages as read by current user
    await Message.updateMany(
      { chatRoom: roomId, readBy: { $ne: req.user._id } },
      { $push: { readBy: req.user._id } }
    );

    res.json(messages.reverse()); // Return in chronological order
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Unable to load messages' });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { content, messageType = 'text' } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // Verify user is participant in the room
    const room = await ChatRoom.findById(roomId);
    if (!room || !room.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const message = await Message.create({
      chatRoom: roomId,
      sender: req.user._id,
      content: content.trim(),
      messageType,
      readBy: [req.user._id] // Sender has read their own message
    });

    // Update room's last message
    await ChatRoom.findByIdAndUpdate(roomId, {
      lastMessage: content.trim(),
      updatedAt: new Date()
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName avatarUrl');

    res.json(populatedMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Unable to send message' });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Verify user is participant in the room
    const room = await ChatRoom.findById(roomId);
    if (!room || !room.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Message.updateMany(
      { chatRoom: roomId, readBy: { $ne: req.user._id } },
      { $push: { readBy: req.user._id } }
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Error marking messages as read:', error);
    res.status(500).json({ message: 'Unable to mark messages as read' });
  }
};

module.exports = {
  getChatRooms,
  createChatRoom,
  getMessages,
  sendMessage,
  markAsRead
};
