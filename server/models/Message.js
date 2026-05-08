const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
  subject:   { type: String },
  body:      { type: String, required: true },
  read:      { type: Boolean, default: false },
  replyTo:   { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
