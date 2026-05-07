const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  code:     { type: String, required: true, unique: true, uppercase: true },
  name:     { type: String, required: true },
  grade:    { type: Number, required: true },
  stream:   { type: String, default: 'General' },
  teacher:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  syllabus: [{ unit: String, topics: [String] }],
}, { timestamps: true });

module.exports = mongoose.model('Course', subjectSchema);
