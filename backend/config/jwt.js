const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'supersecretjwtkey', {
    expiresIn: '7d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkey');
};

module.exports = { generateToken, verifyToken };
