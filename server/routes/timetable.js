const router    = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const Timetable = require('../models/Timetable');
const Student   = require('../models/Student');

router.get('/my', protect, allow('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const tt = await Timetable.findOne({
      grade: student.grade,
      section: student.section,
      academicYear: student.academicYear,
      isActive: true,
    }).populate('slots.course', 'name code syllabus');
    res.json(tt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', protect, async (req, res) => {
  try {
    const tt = await Timetable.findById(req.params.id).populate('slots.course', 'name code syllabus');
    res.json(tt);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', protect, allow('admin'), async (req, res) => {
  try {
    const tt = await Timetable.create(req.body);
    res.status(201).json(tt);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
