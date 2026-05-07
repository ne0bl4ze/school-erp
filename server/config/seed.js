require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose  = require('mongoose');
const User      = require('../models/User');
const Student   = require('../models/Student');
const Course    = require('../models/Course');
const Timetable = require('../models/Timetable');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding…');

  // Clear demo accounts
  await User.deleteMany({ email: { $in: ['admin@erp.edu','teacher@erp.edu','student@erp.edu'] } });
  await Student.deleteMany({});

  // Admin
  const admin = await new User({ name:'School Admin', email:'admin@erp.edu', password:'Admin@123', role:'admin' }).save();
  console.log('Admin:', admin.email);

  // Teacher — use .save() so bcrypt pre-save hook fires
  const teacher = await new User({ name:'Ms. R. Kumar', email:'teacher@erp.edu', password:'Teacher@123', role:'teacher' }).save();
  console.log('Teacher:', teacher.email);

  // Student
  const studentUser = await new User({ name:'Alex Johnson', email:'student@erp.edu', password:'Student@123', role:'student' }).save();
  await new Student({
    user: studentUser._id,
    admissionNo: 'SCH2024001',
    grade: 8,
    section: 'A',
    stream: 'General',
    academicYear: '2025-26',
    classTeacher: teacher._id,
  }).save();
  console.log('Student:', studentUser.email);

  // Subjects for Grade 8
  const subjects = await Promise.all([
    { code:'G8-ENG', name:'English',          grade:8, teacher:teacher._id },
    { code:'G8-MAT', name:'Mathematics',       grade:8, teacher:teacher._id },
    { code:'G8-SCI', name:'Science',           grade:8, teacher:teacher._id },
    { code:'G8-SST', name:'Social Studies',    grade:8, teacher:teacher._id },
    { code:'G8-CS',  name:'Computer Science',  grade:8, teacher:teacher._id },
    { code:'G8-HIN', name:'Hindi',             grade:8, teacher:teacher._id },
  ].map(s => Course.findOneAndUpdate({ code: s.code }, s, { upsert: true, new: true })));
  console.log('Subjects seeded:', subjects.length);

  // Timetable
  await Timetable.findOneAndUpdate(
    { grade:8, section:'A', academicYear:'2025-26' },
    {
      grade:8, section:'A', academicYear:'2025-26', isActive:true,
      slots: [
        { day:'Monday',    startTime:'08:00', endTime:'08:45', course:subjects[0]._id, room:'Room 8A', type:'lecture' },
        { day:'Monday',    startTime:'08:45', endTime:'09:30', course:subjects[1]._id, room:'Room 8A', type:'lecture' },
        { day:'Monday',    startTime:'09:45', endTime:'10:30', course:subjects[2]._id, room:'Lab 1',   type:'lab' },
        { day:'Tuesday',   startTime:'08:00', endTime:'08:45', course:subjects[3]._id, room:'Room 8A', type:'lecture' },
        { day:'Tuesday',   startTime:'08:45', endTime:'09:30', course:subjects[4]._id, room:'Lab 2',   type:'lab' },
        { day:'Tuesday',   startTime:'09:45', endTime:'10:30', course:subjects[5]._id, room:'Room 8A', type:'lecture' },
        { day:'Wednesday', startTime:'08:00', endTime:'08:45', course:subjects[1]._id, room:'Room 8A', type:'lecture' },
        { day:'Wednesday', startTime:'08:45', endTime:'09:30', course:subjects[2]._id, room:'Room 8A', type:'lecture' },
        { day:'Wednesday', startTime:'09:45', endTime:'10:30', course:subjects[0]._id, room:'Room 8A', type:'lecture' },
        { day:'Thursday',  startTime:'08:00', endTime:'08:45', course:subjects[4]._id, room:'Lab 2',   type:'lab' },
        { day:'Thursday',  startTime:'08:45', endTime:'09:30', course:subjects[3]._id, room:'Room 8A', type:'lecture' },
        { day:'Thursday',  startTime:'09:45', endTime:'10:30', course:subjects[5]._id, room:'Room 8A', type:'lecture' },
        { day:'Friday',    startTime:'08:00', endTime:'08:45', course:subjects[2]._id, room:'Room 8A', type:'lecture' },
        { day:'Friday',    startTime:'08:45', endTime:'09:30', course:subjects[1]._id, room:'Room 8A', type:'lecture' },
        { day:'Friday',    startTime:'09:45', endTime:'10:30', course:subjects[0]._id, room:'Room 8A', type:'lecture' },
      ],
    },
    { upsert:true, new:true }
  );
  console.log('Timetable seeded');

  console.log('\n✓ Seed complete');
  console.log('  Admin:   admin@erp.edu   / Admin@123');
  console.log('  Teacher: teacher@erp.edu / Teacher@123');
  console.log('  Student: student@erp.edu / Student@123');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
