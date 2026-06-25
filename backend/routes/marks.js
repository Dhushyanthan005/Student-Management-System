const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { enterMarks, getCourseMarks, getMyMarks, getMarksReport } = require('../controllers/marksController');

router.use(protect);
router.post('/', authorize('faculty'), enterMarks);
router.get('/me', authorize('student'), getMyMarks);
router.get('/report', authorize('admin'), getMarksReport);
router.get('/:courseId', authorize('admin', 'faculty'), getCourseMarks);

module.exports = router;
