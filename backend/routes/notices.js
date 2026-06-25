const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { getNotices, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');

router.use(protect);
router.get('/', getNotices);
router.post('/', authorize('admin'), createNotice);
router.put('/:id', authorize('admin'), updateNotice);
router.delete('/:id', authorize('admin'), deleteNotice);

module.exports = router;
