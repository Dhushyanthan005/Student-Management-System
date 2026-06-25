require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('node:crypto');
const User = require('./models/User');
const Student = require('./models/Student');
const Faculty = require('./models/Faculty');
const Course = require('./models/Course');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB...');

  // Admin
  let adminUser = await User.findOne({ email: 'admin@sms.com' });
  if (!adminUser) {
    adminUser = await User.create({ name: 'Admin', email: 'admin@sms.com', password: 'admin123', role: 'admin' });
    console.log('✅ Admin created — admin@sms.com / admin123');
  } else {
    console.log('ℹ️  Admin already exists — admin@sms.com / admin123');
  }

  // Student
  let studentUser = await User.findOne({ email: 'student@sms.com' });
  if (!studentUser) {
    studentUser = await User.create({ name: 'Test Student', email: 'student@sms.com', password: 'student123', role: 'student' });
    await Student.create({ user: studentUser._id, studentId: 'STU-001', rollNo: 'R001', department: 'Computer Science', year: 2, semester: 3 });
    console.log('✅ Student created — student@sms.com / student123');
  } else {
    console.log('ℹ️  Student already exists — student@sms.com / student123');
  }

  // Faculty
  let facultyUser = await User.findOne({ email: 'faculty@sms.com' });
  if (!facultyUser) {
    facultyUser = await User.create({ name: 'Dr. Jane Smith', email: 'faculty@sms.com', password: 'faculty123', role: 'faculty' });
    await Faculty.create({
      user: facultyUser._id,
      facultyId: 'FAC-001',
      department: 'Computer Science',
      designation: 'Associate Professor',
      passwordSetup: true,
      setupToken: crypto.createHash('sha256').update('seed').digest('hex'),
      setupTokenExpire: Date.now(),
    });
    console.log('✅ Faculty created — faculty@sms.com / faculty123');
  } else {
    console.log('ℹ️  Faculty already exists — faculty@sms.com / faculty123');
  }

  // Courses
  const count = await Course.countDocuments();
  if (count === 0) {
    await Course.insertMany([
      { courseCode: 'CS101', courseName: 'Data Structures', department: 'Computer Science', semester: 3, credits: 4 },
      { courseCode: 'CS102', courseName: 'Operating Systems', department: 'Computer Science', semester: 3, credits: 3 },
      { courseCode: 'CS103', courseName: 'Database Management', department: 'Computer Science', semester: 4, credits: 3 },
    ]);
    console.log('✅ Sample courses created');
  } else {
    console.log('ℹ️  Courses already exist');
  }

  console.log('\n🎉 Seed complete!\n');
  console.log('Demo credentials:');
  console.log('  Admin   → admin@sms.com   / admin123');
  console.log('  Student → student@sms.com / student123');
  console.log('  Faculty → faculty@sms.com / faculty123');
  process.exit();
}

seed().catch(err => { console.error(err); process.exit(1); });
