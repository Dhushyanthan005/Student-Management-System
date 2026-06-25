const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  facultyId: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  designation: { type: String, required: true },
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  passwordSetup: { type: Boolean, default: false },
  setupToken: String,
  setupTokenExpire: Date,
}, { timestamps: true });

module.exports = mongoose.model('Faculty', facultySchema);
