const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  internalMarks: { type: Number, default: 0, min: 0, max: 40 },
  semesterMarks: { type: Number, default: 0, min: 0, max: 60 },
  grade: { type: String, default: '' },
  enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Faculty' },
}, { timestamps: true });

marksSchema.index({ student: 1, course: 1 }, { unique: true });

marksSchema.pre('save', function () {
  const total = this.internalMarks + this.semesterMarks;
  if (total >= 90) this.grade = 'A+';
  else if (total >= 80) this.grade = 'A';
  else if (total >= 70) this.grade = 'B+';
  else if (total >= 60) this.grade = 'B';
  else if (total >= 50) this.grade = 'C';
  else if (total >= 40) this.grade = 'D';
  else this.grade = 'F';
});

module.exports = mongoose.model('Marks', marksSchema);
