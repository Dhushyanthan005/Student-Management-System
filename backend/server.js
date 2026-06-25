require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

connectDB();

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/students', require('./routes/students'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/marks', require('./routes/marks'));
app.use('/api/leaves', require('./routes/leaves'));
app.use('/api/notices', require('./routes/notices'));
app.use('/api/stats', require('./routes/stats'));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
