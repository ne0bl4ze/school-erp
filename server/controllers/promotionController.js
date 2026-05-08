const Promotion = require('../models/Promotion');
const Student   = require('../models/Student');

exports.list = async (req, res) => {
  try {
    const promotions = await Promotion.find()
      .populate('promotedBy', 'name')
      .sort({ promotedAt: -1 });
    res.json(promotions);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.preview = async (req, res) => {
  try {
    const { fromGrade, academicYear } = req.body;
    const students = await Student.find({ grade: Number(fromGrade), academicYear })
      .populate('user', 'name email');
    res.json(students.map(s => ({
      _id:         s._id,
      name:        s.user?.name,
      admissionNo: s.admissionNo,
      grade:       s.grade,
      section:     s.section,
      suggestedToGrade: s.grade < 12 ? s.grade + 1 : s.grade,
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.execute = async (req, res) => {
  try {
    const { academicYear, toAcademicYear, records } = req.body;
    // records: [{ studentId, toGrade, toSection, status, remarks }]
    const promotionRecords = [];
    for (const r of records) {
      const student = await Student.findById(r.studentId);
      if (!student) continue;
      const rec = {
        student:     student._id,
        fromGrade:   student.grade,
        toGrade:     r.toGrade,
        fromSection: student.section,
        toSection:   r.toSection || student.section,
        status:      r.status || 'promoted',
        remarks:     r.remarks,
      };
      promotionRecords.push(rec);
      if (r.status !== 'detained') {
        student.grade        = r.toGrade;
        student.section      = r.toSection || student.section;
        student.academicYear = toAcademicYear || academicYear;
        student.promotionHistory.push({
          fromGrade:    rec.fromGrade,
          toGrade:      rec.toGrade,
          academicYear: academicYear,
          promotedAt:   new Date(),
        });
        await student.save();
      }
    }
    const promotion = await new Promotion({
      academicYear,
      promotedBy: req.user._id,
      records:    promotionRecords,
    }).save();
    res.status(201).json(promotion);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
