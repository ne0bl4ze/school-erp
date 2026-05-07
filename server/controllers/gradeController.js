const Grade   = require('../models/Grade');
const Student = require('../models/Student');

exports.enterGrades = async (req, res) => {
  try {
    const { courseId, academicYear, entries } = req.body;
    for (const e of entries) {
      const scores = [e.term1, e.term2, e.finalExam, e.practical].filter(v => v != null);
      const total  = scores.reduce((a, b) => a + b, 0);
      const pct    = scores.length ? Math.round(total / scores.length) : 0;
      let grade;
      if      (pct >= 90) grade = 'A+';
      else if (pct >= 80) grade = 'A';
      else if (pct >= 70) grade = 'B+';
      else if (pct >= 60) grade = 'B';
      else if (pct >= 50) grade = 'C';
      else if (pct >= 40) grade = 'D';
      else                grade = 'F';

      await Grade.findOneAndUpdate(
        { student: e.studentId, course: courseId, academicYear },
        { term1: e.term1, term2: e.term2, finalExam: e.finalExam, practical: e.practical,
          total, percentage: pct, grade, enteredBy: req.user._id },
        { upsert: true, new: true, runValidators: true }
      );
    }
    res.json({ message: 'Grades saved' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMyGrades = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const grades = await Grade.find({ student: student._id })
      .populate('course', 'name code')
      .sort({ academicYear: 1 });

    // Overall percentage per academic year
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
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCourseGrades = async (req, res) => {
  try {
    const { courseId } = req.params;
    const grades = await Grade.find({ course: courseId })
      .populate({ path: 'student', populate: { path: 'user', select: 'name' } })
      .populate('course', 'name code');
    res.json(grades);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
