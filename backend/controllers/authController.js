const bcrypt = require('bcryptjs');
const { firebaseAdmin, getAuth } = require('../config/firebaseAdmin');
const { generateToken } = require('../config/jwt');
const User = require('../models/User');

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department, jobTitle, jobDescription, joinedAt } = req.body;
    
    // Check MongoDB connection status first
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('Registration failed: MongoDB not connected');
      return res.status(503).json({ 
        message: 'Database is currently unavailable. Please ensure your IP is whitelisted in MongoDB Atlas and try again.' 
      });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const contractFile = req.file;
    const signedContractUrl = contractFile ? `${req.protocol}://${req.get('host')}/uploads/${contractFile.filename}` : '';
    const signedContractFileName = contractFile ? contractFile.originalname : '';

    const hash = await bcrypt.hash(password, 10);
    const isAdminRole = role === 'admin';

    // Create or retrieve user in Firebase Auth
    let firebaseUser;
    const auth = getAuth();
    if (auth) {
      try {
        firebaseUser = await auth.createUser({
          email,
          password,
          displayName: `${firstName} ${lastName}`,
        });
      } catch (firebaseError) {
        if (firebaseError.code === 'auth/email-already-exists') {
          // If user exists in Firebase, try to get their UID
          try {
            firebaseUser = await auth.getUserByEmail(email);
          } catch (getError) {
            console.error('Error fetching existing Firebase user:', getError);
          }
        } else {
          console.error('Firebase user creation error:', firebaseError);
        }
      }
    } else {
      console.warn('Firebase Admin not initialized. Skipping Firebase user creation.');
    }

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
      status: isAdminRole ? 'pending' : 'active',
      firebaseUid: firebaseUser?.uid
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
    console.error('Registration error:', error);
    if (error.name === 'MongooseServerSelectionError') {
      return res.status(503).json({ message: 'Database connection issue. Please try again later.' });
    }
    res.status(500).json({ message: 'Register failed' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, firebaseIdToken } = req.body;
    let user;

    // Check MongoDB connection status first
    const mongoose = require('mongoose');
    if (mongoose.connection.readyState !== 1) {
      console.error('Login failed: MongoDB not connected');
      return res.status(503).json({ 
        message: 'Database is currently unavailable. Please ensure your IP is whitelisted in MongoDB Atlas and try again.' 
      });
    }

    const auth = getAuth();
    if (firebaseIdToken && auth) {
      const decodedToken = await auth.verifyIdToken(firebaseIdToken);
      if (!decodedToken?.email) {
        return res.status(400).json({ message: 'Invalid Firebase token' });
      }
      user = await User.findOne({ email: decodedToken.email });
      if (user && !user.firebaseUid) {
        user.firebaseUid = decodedToken.uid;
        await user.save();
      }

      if (!user) {
        // Auto-create user in MongoDB if they exist in Firebase but not in DB
        const fullName = decodedToken.name || decodedToken.email.split('@')[0];
        const [firstName, ...rest] = fullName.split(' ');
        const lastName = rest.join(' ') || 'User';
        
        // We don't have the clear password here, but they are already authenticated by Firebase
        // We set a random hash as a placeholder for traditional login fallback
        const placeholderPassword = await bcrypt.hash(Math.random().toString(36).slice(-12), 10);

        user = await User.create({
          firstName,
          lastName,
          email: decodedToken.email,
          password: placeholderPassword,
          role: 'employee', // Default role
          department: 'General',
          jobTitle: 'Employee',
          firebaseUid: decodedToken.uid,
          status: 'active' // Auto-activate since they are already in Firebase
        });
        console.log(`Auto-created MongoDB user for existing Firebase account: ${decodedToken.email}`);
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

      // If user is found but has no firebaseUid, try to find/link them
      if (user && !user.firebaseUid && auth) {
        try {
          const firebaseUser = await auth.getUserByEmail(user.email);
          user.firebaseUid = firebaseUser.uid;
          await user.save();
        } catch (firebaseError) {
          // User might not exist in Firebase yet, which is fine for traditional login
          console.log('User not found in Firebase during traditional login');
        }
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
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
    console.error('Login error:', error);
    if (error.name === 'MongooseServerSelectionError') {
      return res.status(503).json({ message: 'Database connection issue. Please try again later.' });
    }
    res.status(500).json({ message: 'Login failed' });
  }
};

const profile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check for Firebase sync status
    const identityStatus = {
      isSyncedWithFirebase: !!user.firebaseUid,
      provider: user.firebaseUid ? 'Firebase/Email' : 'Local'
    };

    res.json({
      ...user.toObject(),
      identityStatus
    });
  } catch (error) {
    console.error('Profile load error:', error);
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
