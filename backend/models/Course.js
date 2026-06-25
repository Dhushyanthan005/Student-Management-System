const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: { type: String, required: true, unique: true, uppercase: true, trim: true },
  courseName: { type: String, required: true, trim: true },
  department: { type: String, required: true },
  semester: { type: Number, required: true },
  credits: { type: Number, default: 3 },
  faculty: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
