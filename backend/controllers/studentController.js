const User = require('../models/User');
const Student = require('../models/Student');

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find().populate('user', 'name email createdAt');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email createdAt')
      .populate('enrolledCourses', 'courseCode courseName');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { name, email, password, studentId, rollNo, department, year, semester } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    const defaultPassword = 'Welcome@123';
  const isDefault = !password;
  const user = await User.create({ name, email, password: password || defaultPassword, role: 'student', mustChangePassword: isDefault });
    const student = await Student.create({ user: user._id, studentId, rollNo, department, year, semester });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { name, email, studentId, rollNo, department, year, semester } = req.body;
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await User.findByIdAndUpdate(student.user, { name, email });
    const updated = await Student.findByIdAndUpdate(req.params.id, { studentId, rollNo, department, year, semester }, { new: true }).populate('user', 'name email');
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await User.findByIdAndDelete(student.user);
    await student.deleteOne();
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'name email createdAt')
      .populate('enrolledCourses', 'courseCode courseName');
    if (!student) return res.status(404).json({ message: 'Student profile not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
