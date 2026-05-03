const Contract = require('../models/Contract');

const uploadContract = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Contract file is required' });
    }
    const contract = await Contract.create({
      user: req.body.userId,
      title: req.body.title || req.file.originalname,
      fileName: req.file.filename,
      fileUrl: `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`,
      expiresAt: req.body.expiresAt,
      uploadedBy: req.user._id
    });
    res.json(contract);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to upload contract' });
  }
};

const getContracts = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'employee') query.user = req.user._id;
    const contracts = await Contract.find(query).populate('user', 'firstName lastName email').sort({ createdAt: -1 });
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load contracts' });
  }
};

module.exports = { uploadContract, getContracts };
