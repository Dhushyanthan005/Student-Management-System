const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  reason: { type: String, required: true, trim: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', default: null },
  reviewNote: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
