const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const ctrl = require('../controllers/gradeController');

router.get('/my',               protect, allow('student'),         ctrl.getMyGrades);
router.get('/course/:courseId', protect, allow('teacher','admin'), ctrl.getCourseGrades);
router.post('/enter',           protect, allow('teacher','admin'), ctrl.enterGrades);

module.exports = router;
