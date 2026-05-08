const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const ctrl = require('../controllers/attendanceController');

router.get('/my',               protect, allow('student'),          ctrl.getMyAttendance);
router.get('/course/:courseId', protect, allow('teacher','admin','principal'),  ctrl.getCourseAttendance);
router.post('/mark',            protect, allow('teacher','admin','principal'),  ctrl.markAttendance);

module.exports = router;
