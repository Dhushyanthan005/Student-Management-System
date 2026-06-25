const Marks = require('../models/Marks');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

exports.enterMarks = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id });
    const { studentId, courseId, internalMarks, semesterMarks } = req.body;
    let marks = await Marks.findOne({ student: studentId, course: courseId });
    if (marks) {
      marks.internalMarks = internalMarks;
      marks.semesterMarks = semesterMarks;
      if (faculty) marks.enteredBy = faculty._id;
    } else {
      marks = new Marks({ student: studentId, course: courseId, internalMarks, semesterMarks, enteredBy: faculty?._id });
    }
    await marks.save();
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseMarks = async (req, res) => {
  try {
    const marks = await Marks.find({ course: req.params.courseId })
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyMarks = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const marks = await Marks.find({ student: student._id }).populate('course', 'courseCode courseName');
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMarksReport = async (req, res) => {
  try {
    const marks = await Marks.find()
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'courseCode courseName');
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
