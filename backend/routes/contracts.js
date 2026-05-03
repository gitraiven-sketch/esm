const express = require('express');
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/auth');
const { permit } = require('../middleware/roles');
const { uploadContract, getContracts } = require('../controllers/contractController');

const router = express.Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage });

router.use(authMiddleware);
router.post('/upload', permit('admin'), upload.single('contract'), uploadContract);
router.get('/', getContracts);

module.exports = router;
