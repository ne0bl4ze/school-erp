const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  day:       { type: String, enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'], required: true },
  startTime: { type: String, required: true },
  endTime:   { type: String, required: true },
  course:    { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  room:      { type: String, required: true },
  type:      { type: String, enum: ['lecture', 'lab', 'activity', 'library'], default: 'lecture' },
});

const timetableSchema = new mongoose.Schema({
  grade:        { type: Number, required: true },
  section:      { type: String, required: true },
  academicYear: { type: String, required: true },
  slots:        [slotSchema],
  isActive:     { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Timetable', timetableSchema);
