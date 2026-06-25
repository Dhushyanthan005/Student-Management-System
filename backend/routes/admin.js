const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createFaculty, getAllFaculty, updateFaculty, deleteFaculty, setupPassword,
} = require('../controllers/adminController');

// Public — faculty sets password via emailed link
router.post('/faculty/setup-password/:token', setupPassword);

router.use(protect, authorize('admin'));

router.route('/faculty')
  .get(getAllFaculty)
  .post(createFaculty);

router.route('/faculty/:id')
  .put(updateFaculty)
  .delete(deleteFaculty);

module.exports = router;
