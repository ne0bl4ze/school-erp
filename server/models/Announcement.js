const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title:      { type: String, required: true },
  body:       { type: String, required: true },
  author:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, enum: ['all', 'student', 'teacher', 'parent', 'principal'], default: 'all' },
  grade:      { type: Number },
  attachments:[{ name: String, url: String }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    date: { type: Date, default: Date.now },
  }],
  pinned: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Announcement', announcementSchema);
