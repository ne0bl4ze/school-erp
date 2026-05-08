const Parent     = require('../models/Parent');
const Student    = require('../models/Student');
const Attendance = require('../models/Attendance');
const Grade      = require('../models/Grade');
const Fee        = require('../models/Fee');
const Timetable  = require('../models/Timetable');

const getParentAndValidate = async (userId, studentId) => {
  const parent = await Parent.findOne({ user: userId });
  if (!parent) throw Object.assign(new Error('Parent profile not found'), { status: 404 });
  const linked = parent.children.some(c => c.toString() === studentId);
  if (!linked) throw Object.assign(new Error('Access denied — not your child'), { status: 403 });
  return parent;
};

exports.myChildren = async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user._id })
      .populate({
        path: 'children',
        populate: [
          { path: 'user', select: 'name email' },
          { path: 'classTeacher', select: 'name email' },
        ],
      });
    if (!parent) return res.status(404).json({ message: 'Parent profile not found' });
    res.json(parent.children);
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

exports.childAttendance = async (req, res) => {
  try {
    await getParentAndValidate(req.user._id, req.params.id);
    const records = await Attendance.find({ student: req.params.id })
      .populate('course', 'name code')
      .sort({ date: -1 });
    const summary = {};
    records.forEach(r => {
      const key = r.course._id.toString();
      if (!summary[key]) summary[key] = { course: r.course, total: 0, present: 0, absent: 0, late: 0 };
      summary[key].total++;
      summary[key][r.status]++;
    });
    res.json({ records, summary: Object.values(summary) });
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

exports.childGrades = async (req, res) => {
  try {
    await getParentAndValidate(req.user._id, req.params.id);
    const grades = await Grade.find({ student: req.params.id })
      .populate('course', 'name code')
      .sort({ academicYear: 1 });
    const yearMap = {};
    grades.forEach(g => {
      if (!yearMap[g.academicYear]) yearMap[g.academicYear] = [];
      yearMap[g.academicYear].push(g);
    });
    const yearSummary = Object.entries(yearMap).map(([year, gs]) => ({
      academicYear: year,
      average: gs.length ? Math.round(gs.reduce((a, g) => a + (g.percentage || 0), 0) / gs.length) : 0,
    }));
    res.json({ grades, yearSummary });
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

exports.childFees = async (req, res) => {
  try {
    await getParentAndValidate(req.user._id, req.params.id);
    const fees = await Fee.find({ student: req.params.id }).sort({ semester: 1 });
    res.json(fees);
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};

exports.childTimetable = async (req, res) => {
  try {
    await getParentAndValidate(req.user._id, req.params.id);
    const student = await Student.findById(req.params.id);
    const tt = await Timetable.findOne({
      grade: student.grade, section: student.section, academicYear: student.academicYear, isActive: true,
    }).populate('slots.course', 'name code syllabus');
    res.json(tt);
  } catch (err) { res.status(err.status || 500).json({ message: err.message }); }
};
