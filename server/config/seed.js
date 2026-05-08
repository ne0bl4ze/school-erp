require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose     = require('mongoose');
const User         = require('../models/User');
const Student      = require('../models/Student');
const Parent       = require('../models/Parent');
const Course       = require('../models/Course');
const Timetable    = require('../models/Timetable');
const Admission    = require('../models/Admission');
const AcademicYear = require('../models/AcademicYear');
const Announcement = require('../models/Announcement');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Seeding…');

  const EMAILS = ['principal@erp.edu','teacher@erp.edu','student@erp.edu','parent@erp.edu','student2@erp.edu'];
  await User.deleteMany({ email: { $in: EMAILS } });
  await Student.deleteMany({});
  await Parent.deleteMany({});

  // Principal
  const principal = await new User({ name:'Dr. S. Sharma', email:'principal@erp.edu', password:'Principal@123', role:'principal' }).save();
  console.log('Principal:', principal.email);

  // Teacher
  const teacher = await new User({ name:'Ms. R. Kumar', email:'teacher@erp.edu', password:'Teacher@123', role:'teacher' }).save();
  console.log('Teacher:', teacher.email);

  // Students
  const studentUser1 = await new User({ name:'Alex Johnson', email:'student@erp.edu', password:'Student@123', role:'student' }).save();
  const studentUser2 = await new User({ name:'Priya Patel', email:'student2@erp.edu', password:'Student@123', role:'student' }).save();

  const student1 = await new Student({
    user: studentUser1._id, admissionNo:'SCH2024001',
    grade:8, section:'A', stream:'General', academicYear:'2025-26',
    classTeacher: teacher._id, parentEmail:'parent@erp.edu',
  }).save();

  const student2 = await new Student({
    user: studentUser2._id, admissionNo:'SCH2024002',
    grade:8, section:'A', stream:'General', academicYear:'2025-26',
    classTeacher: teacher._id, parentEmail:'parent@erp.edu',
  }).save();

  console.log('Students: student@erp.edu, student2@erp.edu');

  // Parent — linked to both students
  const parentUser = await new User({ name:'Mr. A. Johnson', email:'parent@erp.edu', password:'Parent@123', role:'parent' }).save();
  const parentRecord = await new Parent({
    user: parentUser._id,
    children: [student1._id, student2._id],
    phone: '+91 98765 00001',
  }).save();
  await Student.updateMany({ _id: { $in: [student1._id, student2._id] } }, { parent: parentRecord._id });
  console.log('Parent:', parentUser.email, '(linked to 2 students)');

  // Academic Year
  await AcademicYear.findOneAndUpdate(
    { name: '2025-26' },
    { name:'2025-26', startDate: new Date('2025-06-01'), endDate: new Date('2026-03-31'), isCurrent: true },
    { upsert: true, new: true }
  );
  console.log('Academic year seeded');

  // Courses
  const subjects = await Promise.all([
    { code:'G8-ENG', name:'English',         grade:8, teacher:teacher._id },
    { code:'G8-MAT', name:'Mathematics',      grade:8, teacher:teacher._id },
    { code:'G8-SCI', name:'Science',          grade:8, teacher:teacher._id },
    { code:'G8-SST', name:'Social Studies',   grade:8, teacher:teacher._id },
    { code:'G8-CS',  name:'Computer Science', grade:8, teacher:teacher._id },
    { code:'G8-HIN', name:'Hindi',            grade:8, teacher:teacher._id },
  ].map(s => Course.findOneAndUpdate({ code:s.code }, s, { upsert:true, new:true })));
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

  // Sample pending admission
  await Admission.findOneAndUpdate(
    { parentEmail: 'newparent@erp.edu' },
    {
      applicantName:'Rahul Verma', dob: new Date('2013-05-15'), gender:'male',
      grade:8, stream:'General', academicYear:'2025-26',
      parentName:'Mr. V. Verma', parentEmail:'newparent@erp.edu', parentPhone:'+91 90000 11111',
      address:'45 MG Road, Bengaluru', previousSchool:'City Public School', status:'pending',
    },
    { upsert:true, new:true }
  );

  // Announcements for different roles
  await Announcement.deleteMany({});
  await Announcement.create([
    { title:'School Reopening Notice', body:'School will reopen on June 2nd after summer holidays.', author:principal._id, targetRole:'all', pinned:true },
    { title:'Term 1 Exam Schedule', body:'Term 1 exams begin on September 15th. Timetable attached.', author:teacher._id, targetRole:'student' },
    { title:'Parent-Teacher Meeting', body:'PTM scheduled for Saturday June 14th from 9 AM to 1 PM.', author:principal._id, targetRole:'parent' },
    { title:'Staff Meeting', body:'Mandatory staff meeting on Friday at 4 PM in the conference room.', author:principal._id, targetRole:'teacher' },
  ]);

  console.log('\n✓ Seed complete');
  console.log('  Principal: principal@erp.edu / Principal@123');
  console.log('  Teacher:   teacher@erp.edu   / Teacher@123');
  console.log('  Student:   student@erp.edu   / Student@123');
  console.log('  Student2:  student2@erp.edu  / Student@123');
  console.log('  Parent:    parent@erp.edu    / Parent@123');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
