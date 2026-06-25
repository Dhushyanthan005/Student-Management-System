const express = require('express');
const router = express.Router();
const { login, registerAdmin, registerStudent, forgotPassword, resetPassword, getMe, changePassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.post('/register/admin', registerAdmin);
router.post('/register/student', registerStudent);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

module.exports = router;
