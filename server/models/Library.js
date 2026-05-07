const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  author:      { type: String, required: true },
  isbn:        { type: String, unique: true },
  category:    { type: String },
  totalCopies: { type: Number, default: 1 },
  available:   { type: Number, default: 1 },
}, { timestamps: true });

const issueSchema = new mongoose.Schema({
  student:   { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  book:      { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  issueDate: { type: Date, default: Date.now },
  dueDate:   { type: Date, required: true },
  returnDate:{ type: Date },
  fine:      { type: Number, default: 0 },
  status:    { type: String, enum: ['issued', 'returned', 'overdue'], default: 'issued' },
}, { timestamps: true });

const Book  = mongoose.model('Book', bookSchema);
const Issue = mongoose.model('Issue', issueSchema);

module.exports = { Book, Issue };
