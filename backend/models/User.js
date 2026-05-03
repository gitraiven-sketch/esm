const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  department: { type: String, default: 'General' },
  jobTitle: { type: String, default: 'Employee' },
  jobDescription: { type: String, default: '' },
  googleId: { type: String, sparse: true }, // For Google OAuth users
  profilePicture: { type: String }, // Profile picture URL from Google
  avatarUrl: { type: String, default: '' },
  signedContractUrl: { type: String, default: '' },
  signedContractFileName: { type: String, default: '' },
  phone: { type: String, default: '' },
  joinedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
  lastSeen: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
