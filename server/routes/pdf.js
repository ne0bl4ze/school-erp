const router    = require('express').Router();
const { protect } = require('../middleware/auth');
const Student   = require('../models/Student');
const Grade     = require('../models/Grade');
const Fee       = require('../models/Fee');
const Timetable = require('../models/Timetable');
const pdf       = require('../utils/pdfGenerator');

router.get('/report-card/:year', protect, async (req, res) => {
  try {
    const academicYear = decodeURIComponent(req.params.year);
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name');
    const grades  = await Grade.find({ student: student._id, academicYear }).populate('course', 'name code');
    pdf.generateReportCard(res, { student, grades, academicYear });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/fee-receipt/:term', protect, async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id }).populate('user', 'name');
    const fee     = await Fee.findOne({ student: student._id, semester: Number(req.params.term) });
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    pdf.generateFeeReceipt(res, { fee, student });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/timetable', protect, async (req, res) => {
  try {
    const student   = await Student.findOne({ user: req.user._id });
    const timetable = await Timetable.findOne({
      grade: student.grade, section: student.section, isActive: true,
    }).populate('slots.course', 'name code');
    pdf.generateTimetable(res, { timetable, grade: student.grade, section: student.section });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
