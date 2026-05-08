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
const Attendance   = require('../models/Attendance');
const Grade        = require('../models/Grade');
const Fee          = require('../models/Fee');
const Leave        = require('../models/Leave');
const { Book, Issue } = require('../models/Library');

// ── DATA POOLS ─────────────────────────────────────────────
const FIRST_NAMES = [
  'Aarav','Aditi','Akash','Ananya','Anika','Arjun','Aryan','Avni',
  'Bhavya','Chirag','Deepika','Dhruv','Divya','Gautam','Ishaan','Isha',
  'Kabir','Karan','Kavya','Krish','Lakshmi','Manav','Meera','Mihir',
  'Nandini','Nikhil','Nisha','Om','Pooja','Pranav','Priya','Rahul',
  'Riya','Rohan','Saanvi','Sakshi','Sarthak','Shivani','Sneha','Sonal',
  'Suresh','Tanvi','Tushar','Uday','Vanya','Varun','Vibha','Vivaan','Yash','Zara',
];
const LAST_NAMES = [
  'Sharma','Patel','Kumar','Singh','Mehta','Verma','Reddy','Nair',
  'Iyer','Gupta','Joshi','Shah','Malhotra','Bose','Kapoor','Agarwal',
  'Saxena','Chauhan','Rao','Pillai',
];
const PARENT_FIRST = ['Ramesh','Suresh','Mahesh','Rakesh','Rajesh','Dinesh','Pradeep','Sanjay','Vijay','Ajay'];
const PARENT_LAST  = LAST_NAMES;
const STREAMS_BY_GRADE = {
  6:'General',7:'General',8:'General',9:'General',10:'General',11:'Science',12:'Science',
};

const rand  = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randN = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ── SUBJECTS PER GRADE ──────────────────────────────────────
const SUBJECT_TEMPLATES = {
  6:  [{ code:'G6-ENG',name:'English',},{ code:'G6-MAT',name:'Mathematics'},{ code:'G6-SCI',name:'Science'},{ code:'G6-SST',name:'Social Studies'},{ code:'G6-HIN',name:'Hindi'},{ code:'G6-ART',name:'Art & Craft'}],
  7:  [{ code:'G7-ENG',name:'English'},{ code:'G7-MAT',name:'Mathematics'},{ code:'G7-SCI',name:'Science'},{ code:'G7-SST',name:'Social Studies'},{ code:'G7-HIN',name:'Hindi'},{ code:'G7-CS',name:'Computer Science'}],
  8:  [{ code:'G8-ENG',name:'English'},{ code:'G8-MAT',name:'Mathematics'},{ code:'G8-SCI',name:'Science'},{ code:'G8-SST',name:'Social Studies'},{ code:'G8-CS',name:'Computer Science'},{ code:'G8-HIN',name:'Hindi'}],
  9:  [{ code:'G9-ENG',name:'English'},{ code:'G9-MAT',name:'Mathematics'},{ code:'G9-SCI',name:'Science'},{ code:'G9-SST',name:'Social Studies'},{ code:'G9-HIN',name:'Hindi'},{ code:'G9-CS',name:'Computer Science'}],
  10: [{ code:'G10-ENG',name:'English'},{ code:'G10-MAT',name:'Mathematics'},{ code:'G10-SCI',name:'Science'},{ code:'G10-SST',name:'Social Studies'},{ code:'G10-HIN',name:'Hindi'},{ code:'G10-CS',name:'Computer Science'}],
  11: [{ code:'G11-PHY',name:'Physics'},{ code:'G11-CHE',name:'Chemistry'},{ code:'G11-MAT',name:'Mathematics'},{ code:'G11-ENG',name:'English'},{ code:'G11-CS',name:'Computer Science'},{ code:'G11-BIO',name:'Biology'}],
  12: [{ code:'G12-PHY',name:'Physics'},{ code:'G12-CHE',name:'Chemistry'},{ code:'G12-MAT',name:'Mathematics'},{ code:'G12-ENG',name:'English'},{ code:'G12-CS',name:'Computer Science'},{ code:'G12-BIO',name:'Biology'}],
};

// ── STUDENT ROSTER (50 students) ────────────────────────────
const STUDENT_ROSTER = [
  // Grade 6 – Section A (7 students)
  { grade:6, section:'A', stream:'General' },
  { grade:6, section:'A', stream:'General' },
  { grade:6, section:'A', stream:'General' },
  { grade:6, section:'A', stream:'General' },
  { grade:6, section:'A', stream:'General' },
  { grade:6, section:'A', stream:'General' },
  { grade:6, section:'A', stream:'General' },
  // Grade 7 – Section A (7 students)
  { grade:7, section:'A', stream:'General' },
  { grade:7, section:'A', stream:'General' },
  { grade:7, section:'A', stream:'General' },
  { grade:7, section:'A', stream:'General' },
  { grade:7, section:'A', stream:'General' },
  { grade:7, section:'A', stream:'General' },
  { grade:7, section:'B', stream:'General' },
  // Grade 8 – Sections A & B (8 students — 2 already seeded in base seed)
  { grade:8, section:'A', stream:'General' },
  { grade:8, section:'A', stream:'General' },
  { grade:8, section:'A', stream:'General' },
  { grade:8, section:'B', stream:'General' },
  { grade:8, section:'B', stream:'General' },
  { grade:8, section:'B', stream:'General' },
  { grade:8, section:'B', stream:'General' },
  { grade:8, section:'B', stream:'General' },
  // Grade 9 – Section A (7 students)
  { grade:9, section:'A', stream:'General' },
  { grade:9, section:'A', stream:'General' },
  { grade:9, section:'A', stream:'General' },
  { grade:9, section:'A', stream:'General' },
  { grade:9, section:'A', stream:'General' },
  { grade:9, section:'B', stream:'General' },
  { grade:9, section:'B', stream:'General' },
  // Grade 10 – Section A (7 students)
  { grade:10, section:'A', stream:'General' },
  { grade:10, section:'A', stream:'General' },
  { grade:10, section:'A', stream:'General' },
  { grade:10, section:'A', stream:'General' },
  { grade:10, section:'B', stream:'General' },
  { grade:10, section:'B', stream:'General' },
  { grade:10, section:'B', stream:'General' },
  // Grade 11 – Science (7 students)
  { grade:11, section:'A', stream:'Science' },
  { grade:11, section:'A', stream:'Science' },
  { grade:11, section:'A', stream:'Science' },
  { grade:11, section:'A', stream:'Science' },
  { grade:11, section:'B', stream:'Science' },
  { grade:11, section:'B', stream:'Science' },
  { grade:11, section:'B', stream:'Commerce' },
  // Grade 12 – Science & Commerce (7 students)
  { grade:12, section:'A', stream:'Science' },
  { grade:12, section:'A', stream:'Science' },
  { grade:12, section:'A', stream:'Science' },
  { grade:12, section:'A', stream:'Science' },
  { grade:12, section:'B', stream:'Science' },
  { grade:12, section:'B', stream:'Commerce' },
  { grade:12, section:'B', stream:'Commerce' },
];

// ── FEE TEMPLATES ────────────────────────────────────────────
const FEE_BY_GRADE = (grade) => {
  const base = grade <= 8 ? 15000 : grade <= 10 ? 18000 : 22000;
  return { tuitionFee: base, hostelFee: 0, examFee: grade >= 10 ? 2000 : 1000, otherFee: 500 };
};

const BOOKS = [
  { title:'Introduction to Algorithms', author:'Thomas H. Cormen', isbn:'978-0262033848', category:'Computer Science', totalCopies:3, available:2 },
  { title:'Organic Chemistry', author:'Paula Bruice', isbn:'978-0321971371', category:'Chemistry', totalCopies:4, available:3 },
  { title:'Physics Concepts', author:'Paul Tipler', isbn:'978-1464135347', category:'Physics', totalCopies:5, available:4 },
  { title:'Wings of Fire', author:'A.P.J. Abdul Kalam', isbn:'978-8173711466', category:'Biography', totalCopies:6, available:5 },
  { title:'The Discovery of India', author:'Jawaharlal Nehru', isbn:'978-0195623598', category:'History', totalCopies:3, available:2 },
  { title:'Maths Olympiad Primer', author:'S.L. Loney', isbn:'978-8121919364', category:'Mathematics', totalCopies:4, available:3 },
  { title:'English Grammar in Use', author:'Raymond Murphy', isbn:'978-0521189064', category:'English', totalCopies:8, available:6 },
  { title:'Science in Action', author:'Robert Winston', isbn:'978-0751360929', category:'General Science', totalCopies:4, available:3 },
];

// ── ATTENDANCE DATES (last 30 school days) ──────────────────
function getSchoolDays(n) {
  const days = [];
  const d    = new Date();
  while (days.length < n) {
    d.setDate(d.getDate() - 1);
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(d));
  }
  return days;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected. Running full seed…\n');

  // ── WIPE EXISTING DATA ────────────────────────────────────
  // Delete all non-admin users created by any seed run
  await User.deleteMany({ role: { $in: ['student', 'parent', 'teacher', 'principal'] } });
  await Student.deleteMany({});
  await Parent.deleteMany({});
  await Grade.deleteMany({});
  await Fee.deleteMany({});
  await Attendance.deleteMany({});
  await Leave.deleteMany({});
  await Course.deleteMany({});
  await Timetable.deleteMany({});
  console.log('Cleared old data');

  // ── PRINCIPAL ─────────────────────────────────────────────
  const principal = await new User({ name:'Dr. S. Sharma', email:'principal@erp.edu', password:'Principal@123', role:'principal' }).save();

  // ── TEACHERS (4 teachers) ─────────────────────────────────
  const teachers = await Promise.all([
    { name:'Ms. R. Kumar',   email:'teacher@erp.edu',   subject:'English & CS' },
    { name:'Mr. A. Verma',   email:'teacher2@erp.edu',  subject:'Mathematics' },
    { name:'Ms. P. Nair',    email:'teacher3@erp.edu',  subject:'Science & Physics' },
    { name:'Mr. S. Mehta',   email:'teacher4@erp.edu',  subject:'Social Studies & History' },
  ].map(t => new User({ name:t.name, email:t.email, password:'Teacher@123', role:'teacher', isActive:true }).save()));
  console.log(`Teachers created: ${teachers.length}`);

  // ── ACADEMIC YEAR ─────────────────────────────────────────
  await AcademicYear.findOneAndUpdate(
    { name:'2025-26' },
    { name:'2025-26', startDate:new Date('2025-06-01'), endDate:new Date('2026-03-31'), isCurrent:true },
    { upsert:true, new:true }
  );

  // ── COURSES (all grades) ──────────────────────────────────
  const allCourses = {};
  for (const [grade, subjects] of Object.entries(SUBJECT_TEMPLATES)) {
    const teacherForGrade = teachers[Number(grade) % teachers.length];
    allCourses[grade] = await Promise.all(
      subjects.map(s => Course.findOneAndUpdate(
        { code: s.code },
        { ...s, grade: Number(grade), stream:'General', teacher: teacherForGrade._id },
        { upsert:true, new:true }
      ))
    );
  }
  console.log('Courses seeded for grades 6–12');

  // ── TIMETABLES — one per grade 6-12, sections A & B ─────
  const SLOT_TEMPLATES = [
    { day:'Monday',    startTime:'08:00', endTime:'08:45', roomSuffix:'A', type:'lecture', ci:0 },
    { day:'Monday',    startTime:'08:45', endTime:'09:30', roomSuffix:'A', type:'lecture', ci:1 },
    { day:'Monday',    startTime:'09:45', endTime:'10:30', roomSuffix:'',  type:'lab',     ci:2, lab:true },
    { day:'Monday',    startTime:'10:45', endTime:'11:30', roomSuffix:'A', type:'lecture', ci:3 },
    { day:'Tuesday',   startTime:'08:00', endTime:'08:45', roomSuffix:'A', type:'lecture', ci:4 },
    { day:'Tuesday',   startTime:'08:45', endTime:'09:30', roomSuffix:'',  type:'lab',     ci:5, lab:true },
    { day:'Tuesday',   startTime:'09:45', endTime:'10:30', roomSuffix:'A', type:'lecture', ci:0 },
    { day:'Tuesday',   startTime:'10:45', endTime:'11:30', roomSuffix:'A', type:'lecture', ci:1 },
    { day:'Wednesday', startTime:'08:00', endTime:'08:45', roomSuffix:'A', type:'lecture', ci:2 },
    { day:'Wednesday', startTime:'08:45', endTime:'09:30', roomSuffix:'A', type:'lecture', ci:3 },
    { day:'Wednesday', startTime:'09:45', endTime:'10:30', roomSuffix:'A', type:'lecture', ci:4 },
    { day:'Wednesday', startTime:'10:45', endTime:'11:30', roomSuffix:'',  type:'lab',     ci:5, lab:true },
    { day:'Thursday',  startTime:'08:00', endTime:'08:45', roomSuffix:'A', type:'lecture', ci:1 },
    { day:'Thursday',  startTime:'08:45', endTime:'09:30', roomSuffix:'A', type:'lecture', ci:0 },
    { day:'Thursday',  startTime:'09:45', endTime:'10:30', roomSuffix:'',  type:'lab',     ci:2, lab:true },
    { day:'Thursday',  startTime:'10:45', endTime:'11:30', roomSuffix:'A', type:'lecture', ci:3 },
    { day:'Friday',    startTime:'08:00', endTime:'08:45', roomSuffix:'A', type:'lecture', ci:4 },
    { day:'Friday',    startTime:'08:45', endTime:'09:30', roomSuffix:'A', type:'lecture', ci:5 },
    { day:'Friday',    startTime:'09:45', endTime:'10:30', roomSuffix:'A', type:'lecture', ci:0 },
    { day:'Friday',    startTime:'10:45', endTime:'11:30', roomSuffix:'A', type:'lecture', ci:1 },
  ];

  for (const grade of [6,7,8,9,10,11,12]) {
    const cs = allCourses[String(grade)] || [];
    if (!cs.length) continue;
    for (const section of ['A','B']) {
      const roomBase = `Room ${grade}${section}`;
      const slots = SLOT_TEMPLATES.map(t => ({
        day:       t.day,
        startTime: t.startTime,
        endTime:   t.endTime,
        course:    cs[t.ci % cs.length]._id,
        room:      t.lab ? `Lab ${grade % 3 + 1}` : roomBase,
        type:      t.type,
      }));
      await Timetable.findOneAndUpdate(
        { grade, section, academicYear:'2025-26' },
        { grade, section, academicYear:'2025-26', isActive:true, slots },
        { upsert:true, new:true }
      );
    }
  }

  // ── 50 STUDENTS ───────────────────────────────────────────
  const schoolDays = getSchoolDays(30);
  const usedNames  = new Set();
  let   admCounter = 2024001;

  const studentRecords = [];
  const parentMap = {};   // parentEmail → parentRecord

  console.log('\nCreating 50 students…');

  for (let i = 0; i < STUDENT_ROSTER.length; i++) {
    const slot = STUDENT_ROSTER[i];

    // Unique name
    let firstName, lastName, fullName;
    do {
      firstName = FIRST_NAMES[i % FIRST_NAMES.length] + (i >= FIRST_NAMES.length ? ` ${String.fromCharCode(65 + Math.floor(i/FIRST_NAMES.length))}` : '');
      lastName  = LAST_NAMES[(i * 3 + 7) % LAST_NAMES.length];
      fullName  = `${firstName} ${lastName}`;
    } while (usedNames.has(fullName) && usedNames.size < 200);
    usedNames.add(fullName);

    const admNo      = `SCH${admCounter++}`;
    const email      = `student${i+1}@erp.edu`;
    const parentFirst= PARENT_FIRST[i % PARENT_FIRST.length];
    const parentEmail= `parent${Math.floor(i/2)+1}@erp.edu`;
    const classTeacher = teachers[slot.grade % teachers.length];
    const courses      = allCourses[String(slot.grade)] || allCourses['8'];
    const dob          = new Date(2024 - slot.grade - 5, randN(0,11), randN(1,28));

    // Student user
    const su = await new User({ name:fullName, email, password:'Student@123', role:'student', isActive:true }).save();

    // Student record
    const st = await new Student({
      user: su._id, admissionNo: admNo,
      grade: slot.grade, section: slot.section, stream: slot.stream,
      academicYear: '2025-26', classTeacher: classTeacher._id,
      dob, parentEmail, phone: `+91 9${randN(1000000000,9999999999)}`,
      address: `${randN(1,200)} ${rand(['MG Road','Park Street','Nehru Nagar','Gandhi Marg','Station Road'])}, ${rand(['Mumbai','Delhi','Bengaluru','Chennai','Hyderabad','Pune','Jaipur'])}`,
    }).save();

    // Parent record
    let parentUser = await User.findOne({ email: parentEmail });
    if (!parentUser) {
      parentUser = await new User({
        name: `${parentFirst} ${lastName}`, email: parentEmail,
        password:'Parent@123', role:'parent', isActive:true,
      }).save();
    }
    let parentRecord = await Parent.findOne({ user: parentUser._id });
    if (!parentRecord) {
      parentRecord = await new Parent({ user: parentUser._id, children: [], phone: `+91 8${randN(1000000000,9999999999)}` }).save();
    }
    await Parent.findByIdAndUpdate(parentRecord._id, { $addToSet: { children: st._id } });
    await Student.findByIdAndUpdate(st._id, { parent: parentRecord._id });

    // ── GRADES ───────────────────────────────────────────
    for (const course of courses) {
      const t1   = randN(45, 95);
      const t2   = randN(48, 96);
      const fin  = randN(50, 98);
      const prac = randN(55, 100);
      try {
        const g = new Grade({
          student: st._id, course: course._id, academicYear: '2025-26',
          term1: t1, term2: t2, finalExam: fin, practical: prac,
          enteredBy: classTeacher._id,
        });
        await g.save();
      } catch {} // ignore duplicate
    }

    // ── FEES (2 terms) ────────────────────────────────────
    const feeTemplate = FEE_BY_GRADE(slot.grade);
    const totalAmt    = feeTemplate.tuitionFee + feeTemplate.examFee + feeTemplate.otherFee;
    const isPaidT1    = Math.random() > 0.15;
    const isPaidT2    = Math.random() > 0.35;

    await new Fee({
      student: st._id, semester: 1,
      tuitionFee: feeTemplate.tuitionFee, hostelFee: 0,
      examFee: feeTemplate.examFee, otherFee: feeTemplate.otherFee,
      totalAmount: totalAmt, paidAmount: isPaidT1 ? totalAmt : 0,
      dueDate: new Date('2025-07-15'),
      status: isPaidT1 ? 'paid' : 'unpaid',
      transactions: isPaidT1 ? [{ amount: totalAmt, method: rand(['cash','online','dd']), reference: `TXN${randN(100000,999999)}`, date: new Date('2025-07-10') }] : [],
    }).save();

    await new Fee({
      student: st._id, semester: 2,
      tuitionFee: feeTemplate.tuitionFee, hostelFee: 0,
      examFee: feeTemplate.examFee, otherFee: feeTemplate.otherFee,
      totalAmount: totalAmt, paidAmount: isPaidT2 ? totalAmt : (Math.random() > 0.5 ? Math.round(totalAmt/2) : 0),
      dueDate: new Date('2025-12-15'),
      status: isPaidT2 ? 'paid' : (Math.random() > 0.5 ? 'partial' : 'unpaid'),
      transactions: isPaidT2 ? [{ amount: totalAmt, method: rand(['cash','online','dd']), reference: `TXN${randN(100000,999999)}`, date: new Date('2025-12-10') }] : [],
    }).save();

    // ── ATTENDANCE (last 30 school days) ──────────────────
    for (const date of schoolDays.slice(0, 20)) {
      for (const course of courses.slice(0, 3)) {
        const roll = Math.random();
        const status = roll < 0.8 ? 'present' : roll < 0.92 ? 'absent' : 'late';
        try {
          await new Attendance({ student: st._id, course: course._id, date, status, markedBy: classTeacher._id }).save();
        } catch {} // ignore duplicate
      }
    }

    // ── LEAVE (random for some students) ─────────────────
    if (Math.random() > 0.65) {
      const fromDate = new Date(schoolDays[randN(5,15)]);
      const toDate   = new Date(fromDate); toDate.setDate(toDate.getDate() + randN(1,3));
      await new Leave({
        student: st._id,
        type:    rand(['medical','personal','family','other']),
        from:    fromDate, to: toDate,
        reason:  rand(['Fever and cold','Family function','Medical appointment','Personal emergency','Relative visit']),
        status:  rand(['pending','approved','approved','rejected']),
        reviewedBy: classTeacher._id,
      }).save();
    }

    studentRecords.push({ user: su, student: st });
    if ((i+1) % 10 === 0) console.log(`  ${i+1}/50 students created…`);
  }

  console.log(`\n✓ 50 students created`);

  // ── LIBRARY BOOKS ─────────────────────────────────────────
  await Book.deleteMany({});
  const books = await Promise.all(BOOKS.map(b => new Book(b).save()));
  console.log(`Books added: ${books.length}`);

  // Issue 10 books to random students
  for (let i = 0; i < 10 && i < studentRecords.length; i++) {
    const book = books[i % books.length];
    if (book.available > 0) {
      const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 14);
      await new Issue({ student: studentRecords[i].student._id, book: book._id, dueDate }).save();
      book.available--; await book.save();
    }
  }

  // ── PENDING ADMISSIONS (5 applications) ──────────────────
  await Admission.deleteMany({ status: 'pending' });
  const admApplicants = [
    { name:'Aryan Kapoor', grade:7, parentName:'Mr. R. Kapoor', parentEmail:'rkapoor@gmail.com', parentPhone:'+91 98111 22333' },
    { name:'Shreya Bose',  grade:9, parentName:'Mrs. S. Bose',  parentEmail:'sbose@gmail.com',   parentPhone:'+91 98222 33444' },
    { name:'Vivaan Rao',   grade:6, parentName:'Mr. K. Rao',    parentEmail:'krao@gmail.com',     parentPhone:'+91 98333 44555' },
    { name:'Tanisha Iyer', grade:11, parentName:'Mr. P. Iyer',  parentEmail:'piyer@gmail.com',    parentPhone:'+91 98444 55666' },
    { name:'Kartik Shah',  grade:8, parentName:'Mr. V. Shah',   parentEmail:'vshah@gmail.com',    parentPhone:'+91 98555 66777' },
  ];
  for (const a of admApplicants) {
    await new Admission({
      applicantName: a.name, grade: a.grade, stream:'General', academicYear:'2025-26',
      parentName: a.parentName, parentEmail: a.parentEmail, parentPhone: a.parentPhone,
      address: `${randN(1,100)} ${rand(['Park Avenue','Lake View','Rose Garden'])}, ${rand(['Mumbai','Delhi','Bangalore'])}`,
      previousSchool: rand(['City Public School','Green Valley School','National Academy','Modern School']),
      status: 'pending', gender: rand(['male','female']),
      dob: new Date(2024 - a.grade - 5, randN(0,11), randN(1,28)),
    }).save();
  }
  console.log('Pending admissions: 5');

  // ── ANNOUNCEMENTS ─────────────────────────────────────────
  await Announcement.deleteMany({});
  await Announcement.create([
    { title:'School Reopening Notice',      body:'School reopens on June 2nd after summer holidays. All students must report in full uniform.',           author:principal._id, targetRole:'all',     pinned:true  },
    { title:'Annual Sports Day 2025',       body:'Annual Sports Day scheduled for November 15th. Students interested in participation contact the PE teacher.', author:principal._id, targetRole:'all', pinned:true },
    { title:'Term 1 Exam Schedule',         body:'Term 1 examinations begin September 15th. Revised timetable will be shared by class teachers.',          author:teachers[0]._id, targetRole:'student' },
    { title:'Parent-Teacher Meeting',       body:'PTM scheduled Saturday June 14th, 9 AM – 1 PM. Parents of all grades are requested to attend.',          author:principal._id, targetRole:'parent'  },
    { title:'Fee Submission Reminder',      body:'Last date for Term 2 fee submission is December 15th. Late fees attract a penalty of ₹100/day.',         author:principal._id, targetRole:'parent'  },
    { title:'Staff Meeting – Mandatory',    body:'All teaching and non-teaching staff must attend the staff meeting on Friday at 4 PM in the conference room.', author:principal._id, targetRole:'teacher' },
    { title:'Science Exhibition 2025',      body:'Annual Science Exhibition on October 10th. All Grade 9–12 students must submit project proposals by September 30th.', author:teachers[2]._id, targetRole:'student' },
    { title:'Holiday Notice – Diwali',      body:'School will remain closed October 20–22 for Diwali vacation. Classes resume October 23rd.',               author:principal._id, targetRole:'all'     },
    { title:'New Library Books Arrived',    body:'The school library has received 50 new books across Science, Mathematics, and Literature. Explore now!',  author:teachers[0]._id, targetRole:'all'   },
    { title:'Grade 10 & 12 Board Prep',     body:'Extra coaching sessions for Grade 10 and 12 students begin from Monday. Attendance is compulsory.',      author:principal._id, targetRole:'student'  },
  ]);
  console.log('Announcements seeded: 10');

  // ── SUMMARY ───────────────────────────────────────────────
  const totalStudents = await Student.countDocuments();
  const totalGrades   = await Grade.countDocuments();
  const totalFees     = await Fee.countDocuments();
  const totalAtt      = await Attendance.countDocuments();

  console.log('\n═══════════════════════════════════════');
  console.log('✓ Full seed complete');
  console.log('═══════════════════════════════════════');
  console.log(`  Students:    ${totalStudents}`);
  console.log(`  Grade records: ${totalGrades}`);
  console.log(`  Fee records:  ${totalFees}`);
  console.log(`  Attendance:   ${totalAtt}`);
  console.log('\nDemo logins:');
  console.log('  Principal: principal@erp.edu  / Principal@123');
  console.log('  Teacher:   teacher@erp.edu    / Teacher@123');
  console.log('  Student:   student1@erp.edu   / Student@123');
  console.log('  Parent:    parent1@erp.edu    / Parent@123');

  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
