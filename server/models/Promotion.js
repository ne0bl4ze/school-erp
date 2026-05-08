const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  academicYear: { type: String, required: true },
  promotedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  promotedAt:   { type: Date, default: Date.now },
  records: [{
    student:     { type: mongoose.Schema.Types.ObjectId, ref: 'Student' },
    fromGrade:   Number,
    toGrade:     Number,
    fromSection: String,
    toSection:   String,
    status:      { type: String, enum: ['promoted','detained'], default: 'promoted' },
    remarks:     String,
  }],
}, { timestamps: true });

module.exports = mongoose.model('Promotion', promotionSchema);
