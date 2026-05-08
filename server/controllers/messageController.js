const Message = require('../models/Message');
const User    = require('../models/User');

exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }],
    })
      .populate('sender', 'name role')
      .populate('recipient', 'name role')
      .populate('student', 'admissionNo grade section')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.send = async (req, res) => {
  try {
    const { recipientId, studentId, subject, body, replyTo } = req.body;
    const msg = await new Message({
      sender:    req.user._id,
      recipient: recipientId,
      student:   studentId,
      subject,
      body,
      replyTo,
    }).save();
    await msg.populate('sender', 'name role');
    await msg.populate('recipient', 'name role');
    res.status(201).json(msg);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.markRead = async (req, res) => {
  try {
    await Message.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ message: 'Marked as read' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
