const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student:      { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  course:       { type: mongoose.Schema.Types.ObjectId, ref: 'Course',  required: true },
  academicYear: { type: String, required: true },
  term1:        { type: Number, min: 0, max: 100 },  // Term 1 exam
  term2:        { type: Number, min: 0, max: 100 },  // Term 2 exam
  finalExam:    { type: Number, min: 0, max: 100 },  // Final / Annual exam
  practical:    { type: Number, min: 0, max: 100 },  // Practical / Project
  total:        { type: Number },
  percentage:   { type: Number },
  grade:        { type: String },
  enteredBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

gradeSchema.index({ student: 1, course: 1, academicYear: 1 }, { unique: true });

gradeSchema.pre('save', function (next) {
  const scores  = [this.term1, this.term2, this.finalExam, this.practical].filter(v => v != null);
  this.total      = scores.reduce((a, b) => a + b, 0);
  this.percentage = scores.length ? Math.round(this.total / scores.length) : 0;
  const p = this.percentage;
  if      (p >= 90) this.grade = 'A+';
  else if (p >= 80) this.grade = 'A';
  else if (p >= 70) this.grade = 'B+';
  else if (p >= 60) this.grade = 'B';
  else if (p >= 50) this.grade = 'C';
  else if (p >= 40) this.grade = 'D';
  else              this.grade = 'F';
  next();
});

module.exports = mongoose.model('Grade', gradeSchema);
