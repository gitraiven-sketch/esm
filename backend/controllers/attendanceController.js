const Attendance = require('../models/Attendance');

const checkIn = async (req, res) => {
  try {
    const date = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const isLate = now.getHours() >= 9 && now.getMinutes() > 15;

    const entry = await Attendance.findOneAndUpdate(
      { user: req.user._id, date },
      {
        user: req.user._id,
        date,
        checkIn: now.toISOString(),
        status: isLate ? 'late' : 'present',
        late: isLate
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Check-in failed' });
  }
};

const checkOut = async (req, res) => {
  try {
    const date = new Date().toISOString().slice(0, 10);
    const now = new Date();
    const entry = await Attendance.findOne({ user: req.user._id, date });
    if (!entry) {
      return res.status(404).json({ message: 'No check-in record found' });
    }
    entry.checkOut = now.toISOString();
    await entry.save();
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: 'Check-out failed' });
  }
};

const history = async (req, res) => {
  try {
    const query = { user: req.user.role === 'employee' ? req.user._id : req.query.userId }; 
    if (!query.user) delete query.user;
    if (req.query.month) {
      const month = req.query.month;
      query.date = { $regex: `^${month}` };
    }
    const records = await Attendance.find(query).populate('user', 'firstName lastName email').sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load attendance history' });
  }
};

module.exports = { checkIn, checkOut, history };
