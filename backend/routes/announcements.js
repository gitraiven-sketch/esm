const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const { createAnnouncement, getAnnouncements } = require('../controllers/announcementController');

router.use(authMiddleware);
router.post('/', permit('admin'), createAnnouncement);
router.get('/', getAnnouncements);

module.exports = router;
