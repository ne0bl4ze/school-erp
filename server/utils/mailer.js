const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

const send = (to, subject, html) =>
  transporter.sendMail({ from: process.env.EMAIL_FROM, to, subject, html });

exports.sendFeeReceipt = (to, { studentName, semester, amount }) =>
  send(to, `Fee Payment Confirmation — Sem ${semester}`, `
    <h2>Fee Payment Received</h2>
    <p>Dear Parent,</p>
    <p>A payment of <strong>₹${amount}</strong> for <strong>${studentName}</strong>
       (Semester ${semester}) has been successfully recorded.</p>
    <p>Thank you.</p>
    <p style="color:#DF740C;font-weight:bold">ERP Student Portal</p>
  `);

exports.sendAttendanceAlert = (to, { studentName, course, percentage }) =>
  send(to, `Low Attendance Alert — ${course}`, `
    <h2>Attendance Warning</h2>
    <p>Dear Parent,</p>
    <p><strong>${studentName}</strong>'s attendance in <strong>${course}</strong>
       has dropped to <strong>${percentage}%</strong>.</p>
    <p>Please ensure regular attendance. Contact the mentor for assistance.</p>
    <p style="color:#DF740C;font-weight:bold">ERP Student Portal</p>
  `);

exports.sendLeaveUpdate = (to, { studentName, status, from, to: toDate }) =>
  send(to, `Leave Application ${status}`, `
    <h2>Leave Status Update</h2>
    <p>Dear Parent,</p>
    <p>The leave application for <strong>${studentName}</strong>
       (${from} to ${toDate}) has been <strong>${status}</strong>.</p>
    <p style="color:#DF740C;font-weight:bold">ERP Student Portal</p>
  `);
