const Admission = require('../models/Admission');
const User      = require('../models/User');
const Student   = require('../models/Student');
const Parent    = require('../models/Parent');

exports.list = async (req, res) => {
  try {
    const { status, year } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (year)   filter.academicYear = year;
    const admissions = await Admission.find(filter)
      .populate('approvedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(admissions);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getOne = async (req, res) => {
  try {
    const adm = await Admission.findById(req.params.id)
      .populate('approvedBy', 'name')
      .populate('enrolledStudentId');
    if (!adm) return res.status(404).json({ message: 'Not found' });
    res.json(adm);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const adm = await new Admission(req.body).save();
    res.status(201).json(adm);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const adm = await Admission.findByIdAndUpdate(
      req.params.id,
      { status, remarks, approvedBy: req.user._id },
      { new: true }
    );
    if (!adm) return res.status(404).json({ message: 'Not found' });
    res.json(adm);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.enroll = async (req, res) => {
  try {
    const { section, classTeacherId, hostelRoom, admissionNo } = req.body;
    const adm = await Admission.findById(req.params.id);
    if (!adm) return res.status(404).json({ message: 'Admission not found' });
    if (adm.status === 'enrolled') return res.status(400).json({ message: 'Already enrolled' });

    // 1. Create student user
    const tempPassword = 'School@' + Math.random().toString(36).slice(-6);
    const studentUser = await new User({
      name:     adm.applicantName,
      email:    adm.parentEmail.replace('@', `.stu${Date.now().toString().slice(-4)}@`) || `${adm.admissionNo || Date.now()}@school.edu`,
      password: tempPassword,
      role:     'student',
    }).save();

    // 2. Create student record
    const student = await new Student({
      user:         studentUser._id,
      admissionNo:  admissionNo || adm.applicationNo,
      grade:        adm.grade,
      section:      section || 'A',
      stream:       adm.stream,
      academicYear: adm.academicYear,
      dob:          adm.dob,
      address:      adm.address,
      parentEmail:  adm.parentEmail,
      hostelRoom:   hostelRoom,
      classTeacher: classTeacherId,
    }).save();

    // 3. Upsert parent user
    let parentUser = await User.findOne({ email: adm.parentEmail });
    let parentRecord;
    if (!parentUser) {
      const parentPass = 'Parent@' + Math.random().toString(36).slice(-6);
      parentUser = await new User({
        name: adm.parentName || 'Parent',
        email: adm.parentEmail,
        password: parentPass,
        role: 'parent',
      }).save();
      parentRecord = await new Parent({
        user: parentUser._id,
        children: [student._id],
        phone: adm.parentPhone,
        address: adm.address,
      }).save();
    } else {
      parentRecord = await Parent.findOneAndUpdate(
        { user: parentUser._id },
        { $addToSet: { children: student._id } },
        { upsert: true, new: true }
      );
    }

    // 4. Link parent to student
    await Student.findByIdAndUpdate(student._id, { parent: parentRecord._id });

    // 5. Mark admission enrolled
    adm.status = 'enrolled';
    adm.enrolledStudentId = student._id;
    await adm.save();

    res.json({ message: 'Enrolled successfully', student, studentEmail: studentUser.email, parentEmail: parentUser.email });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
