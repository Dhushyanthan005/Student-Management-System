const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: String, required: true, unique: true, trim: true },
  rollNo: { type: String, default: '' },
  department: { type: String, required: true },
  year: { type: Number, default: 1, min: 1, max: 5 },
  semester: { type: Number, required: true, min: 1, max: 10 },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
