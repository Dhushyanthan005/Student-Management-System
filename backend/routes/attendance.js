const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { markAttendance, getCourseAttendance, getMyAttendance, getAttendanceReport } = require('../controllers/attendanceController');

router.use(protect);
router.get('/me', authorize('student'), getMyAttendance);
router.get('/report', authorize('admin'), getAttendanceReport);
router.get('/', authorize('admin', 'faculty'), getCourseAttendance);
router.post('/', authorize('faculty'), markAttendance);

module.exports = router;
