const User = require('../models/User');
const Student = require('../models/Student');
const Faculty = require('../models/Faculty');
const Course = require('../models/Course');
const Leave = require('../models/Leave');
const Attendance = require('../models/Attendance');

exports.getDashboardStats = async (req, res) => {
  try {
    const [totalStudents, totalFaculty, totalCourses, pendingLeaves, totalAttendance, presentAttendance] = await Promise.all([
      Student.countDocuments(),
      Faculty.countDocuments(),
      Course.countDocuments(),
      Leave.countDocuments({ status: 'pending' }),
      Attendance.countDocuments(),
      Attendance.countDocuments({ status: 'present' }),
    ]);

    const attendanceRate = totalAttendance ? Math.round((presentAttendance / totalAttendance) * 100) : 0;

    const recentStudents = await Student.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name email');

    res.json({ totalStudents, totalFaculty, totalCourses, pendingLeaves, attendanceRate, recentStudents });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
