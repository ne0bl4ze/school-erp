const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({
  applicationNo:     { type: String, unique: true },
  applicantName:     { type: String, required: true },
  dob:               { type: Date },
  gender:            { type: String, enum: ['male','female','other'] },
  grade:             { type: Number, required: true, min: 1, max: 12 },
  stream:            { type: String, default: 'General' },
  academicYear:      { type: String, required: true },
  parentName:        { type: String },
  parentEmail:       { type: String },
  parentPhone:       { type: String },
  address:           { type: String },
  previousSchool:    { type: String },
  status:            { type: String, enum: ['pending','approved','rejected','enrolled'], default: 'pending' },
  remarks:           { type: String },
  approvedBy:        { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  enrolledStudentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
}, { timestamps: true });

admissionSchema.pre('save', function (next) {
  if (!this.applicationNo) {
    this.applicationNo = 'ADM' + Date.now().toString().slice(-8);
  }
  next();
});

module.exports = mongoose.model('Admission', admissionSchema);
