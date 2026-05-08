const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const ctrl = require('../controllers/admissionController');

router.get('/',             protect, allow('principal','admin'), ctrl.list);
router.post('/',            protect, allow('principal','admin'), ctrl.create);
router.get('/:id',          protect, allow('principal','admin'), ctrl.getOne);
router.put('/:id/status',   protect, allow('principal','admin'), ctrl.updateStatus);
router.post('/:id/enroll',  protect, allow('principal','admin'), ctrl.enroll);

module.exports = router;
