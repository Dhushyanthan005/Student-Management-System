const crypto = require('node:crypto');
const User = require('../models/User');
const Faculty = require('../models/Faculty');
const sendEmail = require('../config/email');

// POST /api/admin/faculty — Admin creates faculty account
exports.createFaculty = async (req, res) => {
  try {
    const { name, email, facultyId, department, designation } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const tempPassword = crypto.randomBytes(8).toString('hex');
    const user = await User.create({ name, email, password: tempPassword, role: 'faculty' });

    const setupToken = crypto.randomBytes(20).toString('hex');
    const faculty = await Faculty.create({
      user: user._id,
      facultyId,
      department,
      designation,
      setupToken: crypto.createHash('sha256').update(setupToken).digest('hex'),
      setupTokenExpire: Date.now() + 24 * 60 * 60 * 1000,
    });

    const setupUrl = `${process.env.CLIENT_URL}/setup-password/${setupToken}`;

    let emailSent = true;
    try {
      await sendEmail({
        to: email,
        subject: 'Faculty Account Created – EduTrack',
        html: `<p>Hello ${name},</p><p>Your faculty account has been created on EduTrack.</p><p>Click the link below to set your password:</p><p><a href="${setupUrl}">${setupUrl}</a></p><p>This link is valid for 24 hours.</p>`,
      });
    } catch (emailErr) {
      console.error('Email failed:', emailErr.message);
      emailSent = false;
    }

    res.status(201).json({
      message: emailSent
        ? 'Faculty account created. Setup link sent via email.'
        : 'Faculty account created. Email not configured — share the setup link manually.',
      faculty,
      setupUrl,
    });
  } catch (err) {
    console.error('Create faculty error:', err);
    res.status(500).json({ message: err.message });
  }
};

// GET /api/admin/faculty
exports.getAllFaculty = async (req, res) => {
  const faculty = await Faculty.find().populate('user', 'name email');
  res.json(faculty);
};

// PUT /api/admin/faculty/:id
exports.updateFaculty = async (req, res) => {
  const faculty = await Faculty.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
  res.json(faculty);
};

// DELETE /api/admin/faculty/:id
exports.deleteFaculty = async (req, res) => {
  const faculty = await Faculty.findById(req.params.id);
  if (!faculty) return res.status(404).json({ message: 'Faculty not found' });
  await User.findByIdAndDelete(faculty.user);
  await faculty.deleteOne();
  res.json({ message: 'Faculty deleted' });
};

// POST /api/admin/faculty/setup-password/:token — Faculty sets password via link
exports.setupPassword = async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const faculty = await Faculty.findOne({
    setupToken: hashed,
    setupTokenExpire: { $gt: Date.now() },
  });

  if (!faculty) return res.status(400).json({ message: 'Invalid or expired setup link' });

  const user = await User.findById(faculty.user);
  user.password = req.body.password;
  await user.save();

  faculty.passwordSetup = true;
  faculty.setupToken = undefined;
  faculty.setupTokenExpire = undefined;
  await faculty.save();

  res.json({ message: 'Password set successfully. You can now log in.' });
};
