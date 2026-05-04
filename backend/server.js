const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDatabase = require('./config/db');
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const attendanceRoutes = require('./routes/attendance');
const announcementRoutes = require('./routes/announcements');
const leaveRoutes = require('./routes/leaves');
const contractRoutes = require('./routes/contracts');
const chatRoutes = require('./routes/chat');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notifications');
const { initializeFirebaseAdmin } = require('./config/firebaseAdmin');

// Load environment variables from backend/.env
dotenv.config();

const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
connectDatabase();

// Initialize Firebase Admin once during startup
initializeFirebaseAdmin();

// Root route for browser / health checks
app.get('/', (req, res) => {
  return res.json({ message: 'API is running' });
});

// API routes should all be namespaced under /api
app.get('/api/test', (req, res) => {
  return res.json({ message: 'API working' });
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);

// Healthcheck route for internal monitoring
app.get('/api/health', (req, res) => {
  return res.json({ status: 'ok', message: 'Employee management backend is running' });
});

// Global 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server on environment port or fallback to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
