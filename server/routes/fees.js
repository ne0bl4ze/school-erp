const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const ctrl = require('../controllers/feeController');

router.get('/my',             protect, allow('student'),       ctrl.getMyFees);
router.post('/',              protect, allow('admin'),          ctrl.createFee);
router.post('/:id/pay',       protect, allow('admin'),          ctrl.recordPayment);

module.exports = router;
