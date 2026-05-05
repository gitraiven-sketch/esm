const jwt = require('jsonwebtoken');
const { firebaseAdmin, getAuth } = require('../config/firebaseAdmin');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      return res.status(401).json({ message: 'Authorization token missing' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');
    } catch {
      try {
        const auth = getAuth();
        if (!auth) throw new Error('Firebase Admin not initialized');
        const firebaseToken = await auth.verifyIdToken(token);
        decoded = { uid: firebaseToken.uid, email: firebaseToken.email };
      } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
      }
    }

    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active. Contact your administrator.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error', error);
    res.status(500).json({ message: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
