const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  admissionNo:   { type: String, required: true, unique: true },
  grade:         { type: Number, required: true, min: 1, max: 12 },
  section:       { type: String, required: true },
  stream:        { type: String, default: 'General' }, // Science / Commerce / Arts / General
  academicYear:  { type: String, required: true },     // e.g. "2025-26"
  dob:           { type: Date },
  phone:         { type: String },
  parentEmail:   { type: String },
  address:       { type: String },
  hostelRoom:    { type: String },
  classTeacher:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
