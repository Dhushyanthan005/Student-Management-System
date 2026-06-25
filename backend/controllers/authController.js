const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const User = require('../models/User');
const Student = require('../models/Student');

const signToken = (id, rememberMe) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: rememberMe ? '30d' : process.env.JWT_EXPIRE,
  });

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id, rememberMe);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role, mustChangePassword: user.mustChangePassword } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// POST /api/auth/register/admin  (only allowed if no admin exists yet)
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists)
      return res.status(403).json({ message: 'Admin account already exists. Contact the existing admin.' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: 'admin' });
    const token = signToken(user._id, false);
    res.status(201).json({ token, user: { id: user._id, name, email, role: 'admin' } });
  } catch (err) {
    console.error('Admin register error:', err);
    res.status(500).json({ message: err.message || 'Server error during registration' });
  }
};

// POST /api/auth/register/student
exports.registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password, role: 'student' });
    const studentId = `STU-${user._id.toString().slice(-6).toUpperCase()}`;
    await Student.create({ user: user._id, studentId, department: 'General', semester: 1 });

    const token = signToken(user._id, false);
    res.status(201).json({ token, user: { id: user._id, name, email, role: 'student' } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: err.message || 'Server error during registration' });
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const sendEmail = require('../config/email');
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: 'No user with that email' });

    const token = user.getResetToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;
    await sendEmail({
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Reset your password: <a href="${resetUrl}">${resetUrl}</a>. Valid for 15 minutes.</p>`,
    });

    res.json({ message: 'Reset link sent to email' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/auth/reset-password/:token
exports.resetPassword = async (req, res) => {
  try {
    const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = signToken(user._id, false);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

// PUT /api/auth/change-password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: 'Current and new password required' });

    const user = await User.findById(req.user._id);
    if (!(await user.matchPassword(currentPassword)))
      return res.status(401).json({ message: 'Current password is incorrect' });

    if (newPassword.length < 6)
      return res.status(400).json({ message: 'New password must be at least 6 characters' });

    user.password = newPassword;
    user.mustChangePassword = false;
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
