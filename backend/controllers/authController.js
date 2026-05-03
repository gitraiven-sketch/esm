const bcrypt = require('bcryptjs');
const { firebaseAdmin } = require('../config/firebaseAdmin');
const { generateToken } = require('../config/jwt');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department, jobTitle, jobDescription, joinedAt } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const contractFile = req.file;
    const signedContractUrl = contractFile ? `${req.protocol}://${req.get('host')}/uploads/${contractFile.filename}` : '';
    const signedContractFileName = contractFile ? contractFile.originalname : '';

    const hash = await bcrypt.hash(password, 10);
    const isAdminRole = role === 'admin';
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hash,
      role: role || 'employee',
      department: department || (role === 'admin' ? 'Management' : 'General'),
      jobTitle: jobTitle || (role === 'admin' ? 'Administrator' : 'Employee'),
      jobDescription: jobDescription || '',
      joinedAt: joinedAt ? new Date(joinedAt) : Date.now(),
      signedContractUrl,
      signedContractFileName,
      status: isAdminRole ? 'pending' : 'active'
    });

    // If admin registration, don't auto-login (they need approval first)
    if (isAdminRole) {
      const userData = user.toObject();
      delete userData.password;
      return res.json({ message: 'Admin registration submitted for approval', user: userData, token: null });
    }

    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    const userData = user.toObject();
    delete userData.password;
    res.json({ user: userData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Register failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, firebaseIdToken } = req.body;
    let user;

    if (firebaseIdToken) {
      const decodedToken = await firebaseAdmin.auth().verifyIdToken(firebaseIdToken);
      if (!decodedToken?.email) {
        return res.status(400).json({ message: 'Invalid Firebase token' });
      }
      user = await User.findOne({ email: decodedToken.email });
      if (!user) {
        // Auto-register Google users
        const fullName = decodedToken.name || decodedToken.email.split('@')[0];
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ') || '';
        const randomPassword = await bcrypt.hash(Math.random().toString(36).slice(-12), 10);

        user = await User.create({
          firstName,
          lastName,
          email: decodedToken.email,
          password: randomPassword, // Random password for Google users
          role: 'employee', // Default role, can be changed later by admin
          department: 'General',
          jobTitle: 'Employee',
          googleId: decodedToken.uid,
          profilePicture: decodedToken.picture || null
        });
      }
    } else {
      // Traditional email/password login
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active. Contact your administrator.' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken({ id: user._id, email: user.email, role: user.role });
    const userData = user.toObject();
    delete userData.password;
    res.json({ user: userData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load profile' });
  }
};

const getPendingAdmins = async (req, res) => {
  try {
    const pending = await User.find({ role: 'admin', status: 'pending' }).select('-password').sort({ createdAt: -1 });
    res.json(pending);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to load pending admins' });
  }
};

const approveAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    if (admin.role !== 'admin') {
      return res.status(400).json({ message: 'User is not an admin' });
    }
    admin.status = 'active';
    await admin.save();
    const userData = admin.toObject();
    delete userData.password;
    res.json({ message: 'Admin approved successfully', user: userData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to approve admin' });
  }
};

const rejectAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.json({ message: 'Admin registration rejected and deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Unable to reject admin' });
  }
};

module.exports = { register, login, profile, getPendingAdmins, approveAdmin, rejectAdmin };
