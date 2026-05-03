const mongoose = require('mongoose');

const ContractSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  fileUrl: { type: String, required: true },
  expiresAt: { type: Date },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Contract', ContractSchema);
