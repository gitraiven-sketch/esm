const Attendance = require('../models/Attendance');
const LeaveRequest = require('../models/LeaveRequest');
const User = require('../models/User');

const getDashboardAnalytics = async (req, res) => {
  try {
    const employees = await User.countDocuments({ role: 'employee' });
    const today = new Date().toISOString().slice(0, 10);
    const present = await Attendance.countDocuments({ date: today, status: { $in: ['present', 'late'] } });
    const absent = await Attendance.countDocuments({ date: today, status: 'absent' });
    const sick = await Attendance.countDocuments({ date: today, status: 'sick' });
    const onLeave = await Attendance.countDocuments({ date: today, status: 'on-leave' });
    const recentLeaves = await LeaveRequest.find().populate('user', 'firstName lastName').sort({ createdAt: -1 }).limit(5);

    res.json({ employees, present, absent, sick, onLeave, recentLeaves });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load analytics' });
  }
};

const getAttendanceGraph = async (req, res) => {
  try {
    const counts = await Attendance.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }]
    );
    res.json(counts);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load attendance graph' });
  }
};

const getPerformanceMetrics = async (req, res) => {
  try {
    const recentReports = await User.aggregate([
      { $match: { role: 'employee' } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);
    res.json({ recentReports, chart: [{ name: 'Attendance', value: 72 }, { name: 'Leave', value: 18 }, { name: 'Sick', value: 10 }] });
  } catch (error) {
    res.status(500).json({ message: 'Unable to load performance metrics' });
  }
};

module.exports = { getDashboardAnalytics, getAttendanceGraph, getPerformanceMetrics };
