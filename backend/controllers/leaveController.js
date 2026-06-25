const Leave = require('../models/Leave');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

exports.applyLeave = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const leave = await Leave.create({ student: student._id, ...req.body });
    res.status(201).json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyLeaves = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const leaves = await Leave.find({ student: student._id }).populate('reviewedBy', 'facultyId department');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate('reviewedBy');
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.reviewLeave = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id });
    const { status, reviewNote } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, reviewNote, reviewedBy: faculty?._id },
      { new: true }
    );
    if (!leave) return res.status(404).json({ message: 'Leave not found' });
    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
