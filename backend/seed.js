const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const connectDatabase = require('./config/db');
const User = require('./models/User');
const Announcement = require('./models/Announcement');
const Attendance = require('./models/Attendance');
const LeaveRequest = require('./models/LeaveRequest');
const Contract = require('./models/Contract');
const Notification = require('./models/Notification');
const WorkReport = require('./models/WorkReport');

dotenv.config();

const runSeed = async () => {
  await connectDatabase();
  await Promise.all([
    User.deleteMany(),
    Announcement.deleteMany(),
    Attendance.deleteMany(),
    LeaveRequest.deleteMany(),
    Contract.deleteMany(),
    Notification.deleteMany(),
    WorkReport.deleteMany()
  ]);

  const adminPassword = await bcrypt.hash('Password123!', 10);
  const employeePassword = await bcrypt.hash('Password123!', 10);

  const admin = await User.create({ firstName: 'Ava', lastName: 'Stone', email: 'admin@example.com', password: adminPassword, role: 'admin', department: 'HR', jobTitle: 'HR Manager' });
  const employee = await User.create({ firstName: 'Ethan', lastName: 'Reed', email: 'employee@example.com', password: employeePassword, role: 'employee', department: 'Engineering', jobTitle: 'Software Engineer' });

  await Announcement.create({ title: 'Welcome to EMS', body: 'This platform is your go-to employee management system.', pinned: true, createdBy: admin._id, targetRole: 'all' });
  await Attendance.create({ user: employee._id, date: new Date().toISOString().slice(0, 10), checkIn: new Date().toISOString(), status: 'present', late: false });
  await LeaveRequest.create({ user: employee._id, type: 'paid', startDate: new Date(), endDate: new Date(Date.now() + 3 * 86400000), reason: 'Family event', status: 'pending' });
  await Contract.create({ user: employee._id, title: 'Employment Agreement', fileName: 'employment-agreement.pdf', fileUrl: 'https://example.com/employment-agreement.pdf', uploadedBy: admin._id });
  await Notification.create({ user: employee._id, title: 'Welcome onboard', description: 'You have been added to the EMS platform.', type: 'announcement' });
  await WorkReport.create({ user: employee._id, title: 'Weekly status', summary: 'Completed onboarding tasks and started the first sprint.' });

  console.log('Seed data created.');
  process.exit(0);
};

runSeed().catch((err) => {
  console.error(err);
  process.exit(1);
});
