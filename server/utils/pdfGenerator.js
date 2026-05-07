const PDFDocument = require('pdfkit');

const ORANGE = '#DF740C';
const BLACK  = '#000000';
const GREY   = '#444444';

function header(doc, title) {
  doc.rect(0, 0, doc.page.width, 60).fill(BLACK);
  doc.fillColor(ORANGE).fontSize(20).font('Helvetica-Bold').text('ERP', 40, 18, { continued: true });
  doc.fillColor('white').fontSize(11).font('Helvetica').text('  School Portal', { continued: false });
  doc.fillColor(GREY).fontSize(13).font('Helvetica-Bold').text(title, 40, 72);
  doc.moveTo(40, 92).lineTo(doc.page.width - 40, 92).strokeColor(ORANGE).lineWidth(2).stroke();
  doc.moveDown();
}

exports.generateReportCard = (res, { student, grades, academicYear }) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=report-card-${academicYear}.pdf`);
  doc.pipe(res);

  header(doc, `Report Card — Academic Year ${academicYear}`);

  doc.moveDown(0.5);
  doc.fillColor(BLACK).fontSize(11).font('Helvetica-Bold').text('Student Details', 40);
  doc.font('Helvetica').fontSize(10).fillColor(GREY);
  doc.text(`Name: ${student.user?.name}`, 40, doc.y + 4);
  doc.text(`Admission No: ${student.admissionNo}   |   Grade: ${student.grade}   |   Section: ${student.section}   |   Stream: ${student.stream || 'General'}`);
  doc.moveDown();

  // Table headers
  const cols = [40, 70, 260, 310, 360, 415, 460, 510];
  const labels = ['#', 'Subject', 'Term 1', 'Term 2', 'Final', 'Practical', 'Avg%', 'Grade'];
  let y = doc.y;

  doc.rect(40, y, doc.page.width - 80, 22).fill(BLACK);
  doc.fillColor('white').fontSize(9).font('Helvetica-Bold');
  labels.forEach((h, i) => {
    doc.text(h, cols[i], y + 6, { width: (cols[i + 1] || 555) - cols[i] - 4, align: 'left' });
  });
  y += 22;

  grades.forEach((g, idx) => {
    doc.rect(40, y, doc.page.width - 80, 22).fill(idx % 2 === 0 ? '#F9F9F9' : 'white');
    doc.fillColor(BLACK).fontSize(9).font('Helvetica');
    const row = [
      idx + 1,
      g.course?.name || '—',
      g.term1     ?? '—',
      g.term2     ?? '—',
      g.finalExam ?? '—',
      g.practical ?? '—',
      g.percentage != null ? `${g.percentage}%` : '—',
      g.grade     ?? '—',
    ];
    row.forEach((v, i) => {
      doc.text(String(v), cols[i], y + 6, { width: (cols[i + 1] || 555) - cols[i] - 4 });
    });
    y += 22;
  });

  if (grades.length > 0) {
    const avg = Math.round(grades.reduce((a, g) => a + (g.percentage || 0), 0) / grades.length);
    doc.moveDown(1.5);
    doc.fillColor(ORANGE).fontSize(12).font('Helvetica-Bold')
       .text(`Overall Average: ${avg}%`, 40);
  }

  doc.end();
};

exports.generateFeeReceipt = (res, { fee, student }) => {
  const doc = new PDFDocument({ margin: 40, size: 'A5' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=fee-receipt-term${fee.semester}.pdf`);
  doc.pipe(res);

  header(doc, `Fee Receipt — Term ${fee.semester}`);
  doc.moveDown(0.5);
  doc.fillColor(BLACK).fontSize(10).font('Helvetica')
     .text(`Student: ${student.user?.name}`)
     .text(`Admission No: ${student.admissionNo}`)
     .text(`Grade: ${student.grade}   Section: ${student.section}`)
     .moveDown();

  const items = [
    ['Tuition Fee',  fee.tuitionFee],
    ['Hostel Fee',   fee.hostelFee],
    ['Exam Fee',     fee.examFee],
    ['Other Fee',    fee.otherFee],
    ['Total',        fee.totalAmount],
    ['Paid',         fee.paidAmount],
    ['Balance Due',  fee.totalAmount - fee.paidAmount],
  ];
  items.forEach(([label, val]) => {
    doc.font(label === 'Total' || label === 'Balance Due' ? 'Helvetica-Bold' : 'Helvetica')
       .fillColor(label === 'Balance Due' && val > 0 ? '#CC0000' : BLACK)
       .text(`${label}: ₹${val ?? 0}`);
  });
  doc.moveDown().fillColor(ORANGE).fontSize(9).text(`Status: ${fee.status?.toUpperCase()}`);
  doc.end();
};

exports.generateTimetable = (res, { timetable, grade, section }) => {
  const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=timetable-grade${grade}.pdf`);
  doc.pipe(res);

  header(doc, `Timetable — Grade ${grade} | Section ${section}`);
  doc.moveDown();

  const days  = ['Monday','Tuesday','Wednesday','Thursday','Friday'];
  const byDay = {};
  days.forEach(d => { byDay[d] = []; });
  (timetable?.slots || []).forEach(s => { if (byDay[s.day]) byDay[s.day].push(s); });

  const colW = (doc.page.width - 80) / days.length;
  let y = doc.y;

  doc.rect(40, y, doc.page.width - 80, 22).fill(BLACK);
  days.forEach((d, i) => {
    doc.fillColor('white').fontSize(10).font('Helvetica-Bold')
       .text(d, 40 + i * colW, y + 6, { width: colW - 4, align: 'center' });
  });
  y += 22;

  const maxSlots = Math.max(...days.map(d => byDay[d].length), 4);
  for (let row = 0; row < maxSlots; row++) {
    doc.rect(40, y, doc.page.width - 80, 40).fill(row % 2 === 0 ? '#F9F9F9' : 'white');
    days.forEach((d, i) => {
      const slot = byDay[d][row];
      if (slot) {
        doc.fillColor(ORANGE).fontSize(8).font('Helvetica-Bold')
           .text(`${slot.startTime}–${slot.endTime}`, 44 + i * colW, y + 4, { width: colW - 8 });
        doc.fillColor(BLACK).fontSize(9).font('Helvetica')
           .text(slot.course?.name || '', 44 + i * colW, y + 16, { width: colW - 8 });
        doc.fillColor(GREY).fontSize(8)
           .text(slot.room, 44 + i * colW, y + 28, { width: colW - 8 });
      }
    });
    y += 40;
  }
  doc.end();
};
