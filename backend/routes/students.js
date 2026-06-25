const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getStudents, getStudent, createStudent, updateStudent, deleteStudent, getMyProfile } = require('../controllers/studentController');

router.use(protect);
router.get('/me', getMyProfile);
router.get('/', authorize('admin', 'faculty'), getStudents);
router.get('/:id', authorize('admin', 'faculty'), getStudent);
router.post('/', authorize('admin'), createStudent);
router.put('/:id', authorize('admin'), updateStudent);
router.delete('/:id', authorize('admin'), deleteStudent);

module.exports = router;
