const Announcement = require('../models/Announcement');

exports.getAll = async (req, res) => {
  try {
    const filter = { $or: [{ targetRole: 'all' }, { targetRole: req.user.role }] };
    const list = await Announcement.find(filter)
      .populate('author', 'name role')
      .sort({ pinned: -1, createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, body, targetRole, grade, pinned } = req.body;
    const ann = await Announcement.create({ title, body, author: req.user._id, targetRole, grade, pinned });
    res.status(201).json(ann);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const ann = await Announcement.findById(req.params.id);
    if (!ann) return res.status(404).json({ message: 'Not found' });
    ann.comments.push({ user: req.user._id, text: req.body.text });
    await ann.save();
    res.json(ann);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
