const Attendance = require('../models/Attendance');
const Student    = require('../models/Student');

exports.markAttendance = async (req, res) => {
  try {
    const { courseId, date, records } = req.body;
    // records: [{ studentId, status }]
    const ops = records.map(({ studentId, status }) => ({
      updateOne: {
        filter: { student: studentId, course: courseId, date: new Date(date) },
        update: { $set: { status, markedBy: req.user._id } },
        upsert: true,
      },
    }));
    await Attendance.bulkWrite(ops);
    res.json({ message: 'Attendance saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const records = await Attendance.find({ student: student._id })
      .populate('course', 'name code')
      .sort({ date: -1 });

    // Aggregate per course
    const summary = {};
    records.forEach(r => {
      const key = r.course._id.toString();
      if (!summary[key]) {
        summary[key] = { course: r.course, total: 0, present: 0, absent: 0, late: 0 };
      }
      summary[key].total++;
      summary[key][r.status]++;
    });

    res.json({ records, summary: Object.values(summary) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseAttendance = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date } = req.query;
    const filter = { course: courseId };
    if (date) filter.date = new Date(date);
    const records = await Attendance.find(filter)
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .sort({ date: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
