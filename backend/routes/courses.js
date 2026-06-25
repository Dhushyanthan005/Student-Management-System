const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getCourses, createCourse, updateCourse, deleteCourse, assignFaculty } = require('../controllers/courseController');

router.use(protect);
router.get('/', getCourses);
router.post('/', authorize('admin'), createCourse);
router.put('/:id', authorize('admin'), updateCourse);
router.delete('/:id', authorize('admin'), deleteCourse);
router.put('/:id/assign-faculty', authorize('admin'), assignFaculty);

module.exports = router;
