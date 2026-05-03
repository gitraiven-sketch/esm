const LeaveRequest = require('../models/LeaveRequest');
const Notification = require('../models/Notification');

const requestLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.create({
      user: req.user._id,
      type: req.body.type || 'paid',
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      reason: req.body.reason
    });

    await Notification.create({
      user: req.user._id,
      title: 'Leave request submitted',
      description: `Leave requested from ${req.body.startDate} to ${req.body.endDate}`,
      type: 'leave'
    });

    res.json(leave);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to submit leave request' });
  }
};

const approveLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    leave.status = 'approved';
    leave.adminComment = req.body.adminComment || 'Approved by admin';
    await leave.save();

    await Notification.create({
      user: leave.user,
      title: 'Leave approved',
      description: `Your leave request has been approved`,
      type: 'leave'
    });

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Unable to approve leave' });
  }
};

const rejectLeave = async (req, res) => {
  try {
    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) return res.status(404).json({ message: 'Leave request not found' });
    leave.status = 'rejected';
    leave.adminComment = req.body.adminComment || 'Rejected by admin';
    await leave.save();

    await Notification.create({
      user: leave.user,
      title: 'Leave rejected',
      description: `Your leave request has been rejected`,
      type: 'leave'
    });

    res.json(leave);
  } catch (error) {
    res.status(500).json({ message: 'Unable to reject leave' });
  }
};

const getLeaves = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'employee') query.user = req.user._id;
    const leaves = await LeaveRequest.find(query).populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(leaves);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load leave requests' });
  }
};

module.exports = { requestLeave, approveLeave, rejectLeave, getLeaves };
