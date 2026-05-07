require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Register all Mongoose models before any route uses them for populate
require('./models/User');
require('./models/Student');
require('./models/Course');
require('./models/Timetable');
require('./models/Attendance');
require('./models/Fee');
require('./models/Grade');
require('./models/Announcement');
require('./models/Leave');
require('./models/Library');

const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',') : true,
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth',          require('./routes/auth'));
app.use('/api/students',      require('./routes/students'));
app.use('/api/timetable',     require('./routes/timetable'));
app.use('/api/attendance',    require('./routes/attendance'));
app.use('/api/fees',          require('./routes/fees'));
app.use('/api/grades',        require('./routes/grades'));
app.use('/api/announcements', require('./routes/announcements'));
app.use('/api/leave',         require('./routes/leave'));
app.use('/api/library',       require('./routes/library'));
app.use('/api/pdf',           require('./routes/pdf'));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
