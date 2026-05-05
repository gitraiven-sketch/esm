const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getChatRooms,
  createChatRoom,
  getMessages,
  sendMessage,
  markAsRead
} = require('../controllers/chatController');

router.use(authMiddleware);

// Chat room routes
router.get('/', getChatRooms);
router.post('/room', createChatRoom);

// Message routes
router.get('/room/:roomId/messages', getMessages);
router.post('/room/:roomId/messages', sendMessage);
router.put('/room/:roomId/read', markAsRead);

module.exports = router;
