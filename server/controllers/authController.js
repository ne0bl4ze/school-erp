const jwt     = require('jsonwebtoken');
const User    = require('../models/User');
const Student = require('../models/Student');
const Parent  = require('../models/Parent');
const Course  = require('../models/Course');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

const getProfile = async (user) => {
  const id   = user._id;
  const role = user.role;
  if (role === 'student') {
    return Student.findOne({ user: id })
      .populate('classTeacher', 'name email')
      .populate('parent');
  }
  if (role === 'parent') {
    return Parent.findOne({ user: id })
      .populate({ path: 'children', populate: { path: 'user', select: 'name email' } });
  }
  if (role === 'teacher') {
    const courses = await Course.find({ teacher: id }).select('name code grade');
    return { courses };
  }
  if (role === 'principal' || role === 'admin') {
    const [studentCount, teacherCount] = await Promise.all([
      Student.countDocuments(),
      User.countDocuments({ role: 'teacher' }),
    ]);
    return { studentCount, teacherCount };
  }
  return null;
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, admissionNo, grade, section, stream, academicYear } = req.body;
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'Email already registered' });
    }
    const user = await new User({ name, email, password, role: role || 'student' }).save();
    if (user.role === 'student') {
      await new Student({ user: user._id, admissionNo, grade, section, stream, academicYear }).save();
    }
    res.status(201).json({ token: signToken(user._id), user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
    const profile = await getProfile(user);
    res.json({ token: signToken(user._id), user, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.me = async (req, res) => {
  try {
    const profile = await getProfile(req.user);
    res.json({ user: req.user, profile });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
