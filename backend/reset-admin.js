require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function resetAdminPassword() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB Atlas...');

  const user = await User.findOne({ role: 'admin' });
  if (!user) {
    console.log('❌ No admin found');
    process.exit(1);
  }

  user.password = '12345678';
  await user.save(); // bcrypt hash applied automatically via pre-save hook

  console.log('✅ Admin password reset successfully!');
  console.log(`   Email   : ${user.email}`);
  console.log(`   Password: 12345678`);
  process.exit();
}

resetAdminPassword().catch(err => { console.error(err); process.exit(1); });
