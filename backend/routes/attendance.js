const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const { checkIn, checkOut, history } = require('../controllers/attendanceController');

router.use(authMiddleware);
router.post('/checkin', permit('employee', 'admin'), checkIn);
router.post('/checkout', permit('employee', 'admin'), checkOut);
router.get('/history', permit('employee', 'admin'), history);

module.exports = router;
