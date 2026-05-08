const router = require('express').Router();
const { protect } = require('../middleware/auth');
const ctrl = require('../controllers/messageController');

router.get('/',             protect, ctrl.getInbox);
router.post('/',            protect, ctrl.send);
router.put('/:id/read',     protect, ctrl.markRead);

module.exports = router;
