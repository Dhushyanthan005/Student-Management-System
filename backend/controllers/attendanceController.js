const Attendance = require('../models/Attendance');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');

exports.markAttendance = async (req, res) => {
  try {
    const faculty = await Faculty.findOne({ user: req.user._id });
    if (!faculty) return res.status(403).json({ message: 'Faculty profile not found' });

    const { courseId, date, records } = req.body;
    // records: [{ studentId, status }]
    const ops = records.map(r => ({
      updateOne: {
        filter: { student: r.studentId, course: courseId, date: new Date(date) },
        update: { $set: { status: r.status, markedBy: faculty._id } },
        upsert: true,
      },
    }));
    await Attendance.bulkWrite(ops);
    res.json({ message: 'Attendance saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseAttendance = async (req, res) => {
  try {
    const { courseId, date } = req.query;
    const filter = { course: courseId };
    if (date) filter.date = new Date(date);
    const records = await Attendance.find(filter).populate({ path: 'student', populate: { path: 'user', select: 'name' } });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const records = await Attendance.find({ student: student._id }).populate('course', 'courseCode courseName');
    const summary = {};
    records.forEach(r => {
      const key = r.course._id.toString();
      if (!summary[key]) summary[key] = { course: r.course, total: 0, present: 0 };
      summary[key].total++;
      if (r.status === 'present') summary[key].present++;
    });
    res.json(Object.values(summary).map(s => ({ ...s, percentage: s.total ? Math.round((s.present / s.total) * 100) : 0 })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAttendanceReport = async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'courseCode courseName');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
