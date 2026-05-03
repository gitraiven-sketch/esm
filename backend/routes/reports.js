const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const { getDashboardAnalytics, getAttendanceGraph, getPerformanceMetrics } = require('../controllers/reportController');

router.use(authMiddleware);
router.get('/dashboard', permit('admin', 'employee'), getDashboardAnalytics);
router.get('/attendance', permit('admin'), getAttendanceGraph);
router.get('/performance', permit('admin'), getPerformanceMetrics);

module.exports = router;
