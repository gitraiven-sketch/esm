const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getNotifications, markRead } = require('../controllers/notificationController');

router.use(authMiddleware);
router.get('/', getNotifications);
router.put('/read/:id', markRead);

module.exports = router;
