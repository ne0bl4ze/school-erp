const Fee     = require('../models/Fee');
const Student = require('../models/Student');
const mailer  = require('../utils/mailer');

exports.getMyFees = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const fees = await Fee.find({ student: student._id }).sort({ semester: 1 });
    res.json(fees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createFee = async (req, res) => {
  try {
    const { studentId, semester, tuitionFee, hostelFee, examFee, otherFee, dueDate } = req.body;
    const total = tuitionFee + (hostelFee || 0) + (examFee || 0) + (otherFee || 0);
    const fee = await Fee.create({ student: studentId, semester, tuitionFee, hostelFee, examFee, otherFee, totalAmount: total, dueDate });
    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.recordPayment = async (req, res) => {
  try {
    const { amount, method, reference } = req.body;
    const fee = await Fee.findById(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });

    fee.transactions.push({ amount, method, reference });
    fee.paidAmount += amount;
    fee.status = fee.paidAmount >= fee.totalAmount ? 'paid' : fee.paidAmount > 0 ? 'partial' : 'unpaid';
    await fee.save();

    // Notify parent if fully paid
    if (fee.status === 'paid') {
      const student = await Student.findById(fee.student).populate('user', 'name');
      if (student?.parentEmail) {
        await mailer.sendFeeReceipt(student.parentEmail, {
          studentName: student.user.name,
          semester: fee.semester,
          amount: fee.totalAmount,
        });
      }
    }
    res.json(fee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
