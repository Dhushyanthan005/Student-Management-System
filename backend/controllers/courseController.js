const Course = require('../models/Course');
const Faculty = require('../models/Faculty');

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate('faculty', 'facultyId department designation').populate({ path: 'faculty', populate: { path: 'user', select: 'name email' } });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const exists = await Course.findOne({ courseCode: req.body.courseCode?.toUpperCase() });
    if (exists) return res.status(400).json({ message: 'Course code already exists' });
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignFaculty = async (req, res) => {
  try {
    const { facultyId } = req.body;
    const course = await Course.findByIdAndUpdate(req.params.id, { faculty: facultyId }, { new: true });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    if (facultyId) {
      await Faculty.findByIdAndUpdate(facultyId, { $addToSet: { assignedCourses: course._id } });
    }
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
