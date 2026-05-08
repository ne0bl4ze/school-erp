const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const ctrl = require('../controllers/promotionController');

router.get('/',          protect, allow('principal','admin'), ctrl.list);
router.post('/preview',  protect, allow('principal','admin'), ctrl.preview);
router.post('/execute',  protect, allow('principal','admin'), ctrl.execute);

module.exports = router;
