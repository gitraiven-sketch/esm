const Announcement = require('../models/Announcement');

const createAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.create({
      title: req.body.title,
      body: req.body.body,
      pinned: req.body.pinned || false,
      createdBy: req.user._id,
      targetRole: req.body.targetRole || 'all'
    });
    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Unable to create announcement' });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const query = {}; 
    if (req.user.role === 'employee') query.targetRole = { $in: ['employee', 'all'] };
    const announcements = await Announcement.find(query).populate('createdBy', 'firstName lastName').sort({ pinned: -1, createdAt: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load announcements' });
  }
};

module.exports = { createAnnouncement, getAnnouncements };
