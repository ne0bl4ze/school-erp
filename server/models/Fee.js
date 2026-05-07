const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student:       { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  semester:      { type: Number, required: true },
  tuitionFee:    { type: Number, required: true },
  hostelFee:     { type: Number, default: 0 },
  examFee:       { type: Number, default: 0 },
  otherFee:      { type: Number, default: 0 },
  totalAmount:   { type: Number, required: true },
  paidAmount:    { type: Number, default: 0 },
  dueDate:       { type: Date, required: true },
  status:        { type: String, enum: ['paid', 'partial', 'unpaid'], default: 'unpaid' },
  transactions: [{
    amount:    Number,
    method:    { type: String, enum: ['cash', 'online', 'dd'] },
    reference: String,
    date:      { type: Date, default: Date.now },
  }],
}, { timestamps: true });

feeSchema.virtual('balance').get(function () {
  return this.totalAmount - this.paidAmount;
});

module.exports = mongoose.model('Fee', feeSchema);
