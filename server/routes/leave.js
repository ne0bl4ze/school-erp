const router  = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const Leave   = require('../models/Leave');
const Student = require('../models/Student');
const mailer  = require('../utils/mailer');

router.get('/my', protect, allow('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const leaves = await Leave.find({ student: student._id }).sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, allow('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const leave = await Leave.create({ ...req.body, student: student._id });
    res.status(201).json(leave);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.get('/all', protect, allow('teacher','admin','principal'), async (req, res) => {
  try {
    const leaves = await Leave.find()
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.put('/:id/review', protect, allow('teacher','admin','principal'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const leave = await Leave.findByIdAndUpdate(
      req.params.id,
      { status, remarks, reviewedBy: req.user._id },
      { new: true }
    ).populate({ path: 'student', populate: { path: 'user', select: 'name' } });
    if (leave?.student?.parentEmail) {
      await mailer.sendLeaveUpdate(leave.student.parentEmail, {
        studentName: leave.student.user.name,
        status,
        from: leave.from.toDateString(),
        to:   leave.to.toDateString(),
      });
    }
    res.json(leave);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
