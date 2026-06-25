const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { applyLeave, getMyLeaves, getAllLeaves, reviewLeave } = require('../controllers/leaveController');

router.use(protect);
router.get('/me', authorize('student'), getMyLeaves);
router.get('/', authorize('admin', 'faculty'), getAllLeaves);
router.post('/', authorize('student'), applyLeave);
router.put('/:id/review', authorize('faculty'), reviewLeave);

module.exports = router;
