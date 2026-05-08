const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const ctrl = require('../controllers/announcementController');

router.get('/',             protect,                        ctrl.getAll);
router.post('/',            protect, allow('teacher','admin','principal'), ctrl.create);
router.post('/:id/comment', protect,                        ctrl.addComment);
router.delete('/:id',       protect, allow('teacher','admin','principal'), ctrl.remove);

module.exports = router;
