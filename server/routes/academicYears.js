const router       = require('express').Router();
const { protect }  = require('../middleware/auth');
const { allow }    = require('../middleware/rbac');
const AcademicYear = require('../models/AcademicYear');

router.get('/', protect, async (req, res) => {
  try {
    res.json(await AcademicYear.find().sort({ name: -1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', protect, allow('principal','admin'), async (req, res) => {
  try {
    const ay = await new AcademicYear(req.body).save();
    res.status(201).json(ay);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id/activate', protect, allow('principal','admin'), async (req, res) => {
  try {
    await AcademicYear.updateMany({}, { isCurrent: false });
    const ay = await AcademicYear.findByIdAndUpdate(req.params.id, { isCurrent: true }, { new: true });
    res.json(ay);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
