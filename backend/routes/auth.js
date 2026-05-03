const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const { register, login, profile, getPendingAdmins, approveAdmin, rejectAdmin } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const { permit } = require('../middleware/roles');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.post('/register', upload.single('signedContract'), register);
router.post('/login', login);
router.get('/profile', authMiddleware, profile);
router.get('/pending-admins', authMiddleware, permit('admin'), getPendingAdmins);
router.post('/approve-admin/:id', authMiddleware, permit('admin'), approveAdmin);
router.post('/reject-admin/:id', authMiddleware, permit('admin'), rejectAdmin);

module.exports = router;
