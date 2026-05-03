const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getChatRooms, createChatRoom } = require('../controllers/chatController');

router.use(authMiddleware);
router.get('/', getChatRooms);
router.post('/room', createChatRoom);

module.exports = router;
