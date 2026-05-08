const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const ctrl = require('../controllers/parentController');

router.get('/my-children',              protect, allow('parent'), ctrl.myChildren);
router.get('/child/:id/attendance',     protect, allow('parent'), ctrl.childAttendance);
router.get('/child/:id/grades',         protect, allow('parent'), ctrl.childGrades);
router.get('/child/:id/fees',           protect, allow('parent'), ctrl.childFees);
router.get('/child/:id/timetable',      protect, allow('parent'), ctrl.childTimetable);

module.exports = router;
