const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const { connectDatabase } = require('./config/db');
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
const Message = require('./models/Message');
const ChatRoom = require('./models/ChatRoom');

// Load environment variables from backend/.env
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);

      // Allow localhost for development
      if (origin.includes('localhost')) return callback(null, true);

      // Allow your production domains (add your actual domains here)
      const allowedOrigins = [
        'https://your-frontend-domain.onrender.com',
        'https://your-admin-domain.onrender.com'
      ];

      if (allowedOrigins.some(allowed => origin.includes(allowed.replace('https://', '')))) {
        return callback(null, true);
      }

      // For now, allow all origins (you should restrict this in production)
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware configuration
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join user to their chat rooms
  socket.on('join-rooms', async (userId) => {
    try {
      const rooms = await ChatRoom.find({ participants: userId });
      rooms.forEach(room => {
        socket.join(`room-${room._id}`);
      });
      socket.userId = userId;
    } catch (error) {
      console.error('Error joining rooms:', error);
    }
  });

  // Handle sending messages
  socket.on('send-message', async (data) => {
    try {
      const { roomId, content, messageType = 'text' } = data;

      if (!content || !content.trim()) return;

      // Verify user is participant in the room
      const room = await ChatRoom.findById(roomId);
      if (!room || !room.participants.includes(socket.userId)) {
        return;
      }

      const message = await Message.create({
        chatRoom: roomId,
        sender: socket.userId,
        content: content.trim(),
        messageType,
        readBy: [socket.userId]
      });

      // Update room's last message
      await ChatRoom.findByIdAndUpdate(roomId, {
        lastMessage: content.trim(),
        updatedAt: new Date()
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'firstName lastName avatarUrl');

      // Emit to all users in the room
      io.to(`room-${roomId}`).emit('new-message', populatedMessage);
    } catch (error) {
      console.error('Error sending message via socket:', error);
    }
  });

  // Handle typing indicators
  socket.on('typing-start', (data) => {
    socket.to(`room-${data.roomId}`).emit('user-typing', {
      userId: socket.userId,
      roomId: data.roomId,
      isTyping: true
    });
  });

  socket.on('typing-stop', (data) => {
    socket.to(`room-${data.roomId}`).emit('user-typing', {
      userId: socket.userId,
      roomId: data.roomId,
      isTyping: false
    });
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Database connection and startup
const startServer = async () => {
  await connectDatabase();

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
  app.use('/auth', authRoutes);
  app.use('/api/employees', employeeRoutes);
  app.use('/employees', employeeRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/attendance', attendanceRoutes);
  app.use('/api/announcements', announcementRoutes);
  app.use('/announcements', announcementRoutes);
  app.use('/api/leaves', leaveRoutes);
  app.use('/leaves', leaveRoutes);
  app.use('/api/contracts', contractRoutes);
  app.use('/contracts', contractRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/chat', chatRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/reports', reportRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/notifications', notificationRoutes);

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
  server.listen(PORT, () => {
    console.log(`Backend server with Socket.io listening on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start backend server:', error);
  process.exit(1);
});
