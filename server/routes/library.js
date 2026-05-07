const router  = require('express').Router();
const { protect } = require('../middleware/auth');
const { allow }   = require('../middleware/rbac');
const { Book, Issue } = require('../models/Library');
const Student = require('../models/Student');

router.get('/books', protect, async (req, res) => {
  try {
    const { q } = req.query;
    const filter = q ? { $or: [{ title: new RegExp(q,'i') }, { author: new RegExp(q,'i') }] } : {};
    res.json(await Book.find(filter).sort({ title: 1 }));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.get('/my', protect, allow('student'), async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    const issues = await Issue.find({ student: student._id }).populate('book', 'title author').sort({ issueDate: -1 });
    res.json(issues);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/issue', protect, allow('admin'), async (req, res) => {
  try {
    const { studentId, bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book || book.available < 1) return res.status(400).json({ message: 'Book not available' });
    const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + 14);
    const issue = await Issue.create({ student: studentId, book: bookId, dueDate });
    book.available--;
    await book.save();
    res.status(201).json(issue);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/return/:id', protect, allow('admin'), async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate('book');
    if (!issue) return res.status(404).json({ message: 'Not found' });
    const now = new Date();
    const overdueDays = Math.max(0, Math.floor((now - issue.dueDate) / 86400000));
    issue.returnDate = now;
    issue.fine = overdueDays * 5;
    issue.status = 'returned';
    await issue.save();
    issue.book.available++;
    await issue.book.save();
    res.json(issue);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
