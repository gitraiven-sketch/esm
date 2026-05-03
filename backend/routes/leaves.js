const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const { requestLeave, approveLeave, rejectLeave, getLeaves } = require('../controllers/leaveController');

router.use(authMiddleware);
router.post('/request', permit('employee', 'admin'), requestLeave);
router.put('/approve/:id', permit('admin'), approveLeave);
router.put('/reject/:id', permit('admin'), rejectLeave);
router.get('/', permit('employee', 'admin'), getLeaves);

module.exports = router;
