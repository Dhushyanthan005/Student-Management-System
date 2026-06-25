const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true, trim: true },
  audience: { type: String, enum: ['all', 'student', 'faculty'], default: 'all' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Notice', noticeSchema);
