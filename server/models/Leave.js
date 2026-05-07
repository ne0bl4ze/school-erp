const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  type:      { type: String, enum: ['medical', 'personal', 'family', 'other'], required: true },
  from:      { type: Date, required: true },
  to:        { type: Date, required: true },
  reason:    { type: String, required: true },
  status:    { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  reviewedBy:{ type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  remarks:   { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Leave', leaveSchema);
