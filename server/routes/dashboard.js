const router     = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const User       = require('../models/User');
const Student    = require('../models/Student');
const Admission  = require('../models/Admission');
const Fee        = require('../models/Fee');
const Attendance = require('../models/Attendance');
const Leave      = require('../models/Leave');
const Message    = require('../models/Message');
const Course     = require('../models/Course');
const Timetable  = require('../models/Timetable');

router.get('/principal', protect, allow('principal','admin'), async (req, res) => {
  try {
    const [students, teachers, pendingAdmissions, unpaidFees, feeStats] = await Promise.all([
      Student.countDocuments(),
      User.countDocuments({ role: 'teacher' }),
      Admission.countDocuments({ status: 'pending' }),
      Fee.countDocuments({ status: { $in: ['unpaid','partial'] } }),
      Fee.aggregate([
        { $group: { _id: '$status', total: { $sum: '$totalAmount' }, paid: { $sum: '$paidAmount' } } }
      ]),
    ]);

    const recentAdmissions = await Admission.find({ status: 'pending' })
      .sort({ createdAt: -1 }).limit(5);

    const gradeBreakdown = await Student.aggregate([
      { $group: { _id: '$grade', count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ students, teachers, pendingAdmissions, unpaidFees, feeStats, recentAdmissions, gradeBreakdown });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/teacher', protect, allow('teacher'), async (req, res) => {
  try {
    const courses = await Course.find({ teacher: req.user._id });
    const courseIds = courses.map(c => c._id);

    const today = new Date();
    today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

    const [attendanceToday, pendingLeaves, unreadMessages] = await Promise.all([
      Attendance.countDocuments({ course: { $in: courseIds }, date: { $gte: today, $lt: tomorrow } }),
      Leave.countDocuments({ status: 'pending' }),
      Message.countDocuments({ recipient: req.user._id, read: false }),
    ]);

    const recentMessages = await Message.find({ recipient: req.user._id })
      .populate('sender', 'name role')
      .populate('student', 'admissionNo grade section')
      .sort({ createdAt: -1 })
      .limit(5);

    const pendingLeaveList = await Leave.find({ status: 'pending' })
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })
      .limit(3);

    res.json({ courses, attendanceToday, pendingLeaves, unreadMessages, recentMessages, pendingLeaveList });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
