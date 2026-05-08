import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Slab:wght@700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #e5e7eb; font-family: 'Roboto', sans-serif; color: #111827; }

  .print-wrapper {
    width: 148mm;
    background: #fff;
    margin: 24px auto;
    padding: 0;
    box-shadow: 0 4px 24px rgba(0,0,0,.18);
    page-break-after: always;
  }

  .doc-header {
    background: #000;
    color: #fff;
    padding: 16px 22px 12px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .school-emblem {
    width: 48px; height: 48px;
    border-radius: 50%;
    background: #DF740C;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Roboto Slab', serif;
    font-size: 16px; font-weight: 700; color: #000;
    flex-shrink: 0;
    border: 2px solid #DF740C;
  }
  .school-info { flex: 1; }
  .school-name { font-family: 'Roboto Slab', serif; font-size: 15px; font-weight: 700; color: #DF740C; }
  .school-sub { font-size: 9px; color: #9ca3af; margin-top: 2px; }

  .orange-rule { height: 3px; background: linear-gradient(90deg, #DF740C 60%, #7a3800); }

  .receipt-title {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    padding: 10px 22px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .receipt-title-text { font-size: 13px; font-weight: 700; color: #111827; }
  .receipt-no { font-size: 10px; color: #6b7280; font-family: monospace; }

  /* Status ribbon */
  .status-ribbon {
    padding: 5px 22px;
    font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
    text-align: center;
  }
  .status-paid    { background: #dcfce7; color: #166534; }
  .status-partial { background: #fef3c7; color: #92400e; }
  .status-unpaid  { background: #fee2e2; color: #991b1b; }

  /* Student info */
  .student-box {
    margin: 14px 22px;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    overflow: hidden;
  }
  .student-box-header {
    background: #111827;
    color: #fff;
    padding: 6px 12px;
    font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase;
  }
  .student-row {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    font-size: 11px;
  }
  .student-row:last-child { border-bottom: none; }
  .student-key {
    width: 90px; flex-shrink: 0;
    padding: 6px 10px;
    font-size: 9px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .4px;
    border-right: 1px solid #e5e7eb;
    background: #f3f4f6;
  }
  .student-val {
    padding: 6px 10px;
    font-weight: 500; color: #111827;
    flex: 1;
  }

  /* Fee table */
  .section-title {
    margin: 14px 22px 6px;
    font-size: 9px; font-weight: 700; color: #6b7280;
    text-transform: uppercase; letter-spacing: 1px;
    display: flex; align-items: center; gap: 8px;
  }
  .section-title::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }

  .fee-table {
    width: calc(100% - 44px);
    margin: 0 22px;
    border-collapse: collapse;
    font-size: 11px;
  }
  .fee-table td {
    padding: 6px 8px;
    border-bottom: 1px solid #f3f4f6;
    color: #374151;
  }
  .fee-table td:last-child { text-align: right; font-weight: 500; }
  .fee-table tr:last-child td { border-bottom: none; }
  .fee-divider td { border-top: 1.5px solid #e5e7eb !important; padding-top: 8px !important; }
  .fee-total td { font-weight: 700; color: #111827; font-size: 12px; }
  .fee-balance td { font-weight: 700; font-size: 12px; }
  .fee-balance.due td { color: #991b1b; }
  .fee-balance.clear td { color: #166534; }

  /* Payment history */
  .txn-table {
    width: calc(100% - 44px);
    margin: 0 22px;
    border-collapse: collapse;
    font-size: 10px;
  }
  .txn-table th {
    background: #111827; color: #fff;
    padding: 5px 8px;
    font-size: 9px; font-weight: 700; letter-spacing: .4px; text-transform: uppercase;
    text-align: left;
  }
  .txn-table td {
    padding: 5px 8px;
    border-bottom: 1px solid #f3f4f6;
    color: #374151;
  }
  .txn-table tr:last-child td { border-bottom: none; }

  /* Signatures */
  .sig-row {
    margin: 18px 22px 0;
    display: flex; justify-content: space-between;
  }
  .sig-block { text-align: center; }
  .sig-line {
    width: 90px;
    border-bottom: 1px solid #374151;
    margin: 0 auto 5px;
    height: 28px;
  }
  .sig-label { font-size: 8px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .4px; }

  /* Footer */
  .doc-footer {
    margin-top: 18px;
    border-top: 1px solid #e5e7eb;
    padding: 8px 22px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .footer-note { font-size: 8px; color: #9ca3af; line-height: 1.5; }
  .school-stamp {
    width: 52px; height: 52px;
    border: 1.5px dashed #d1d5db;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 7px; color: #d1d5db; text-align: center; line-height: 1.3;
    text-transform: uppercase;
  }

  /* Print button */
  .no-print {
    position: fixed; bottom: 24px; right: 24px;
    display: flex; gap: 10px; z-index: 999;
  }
  .btn-print {
    background: #DF740C; color: #000;
    border: none; border-radius: 8px;
    padding: 12px 24px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 12px rgba(223,116,12,.4);
  }
  .btn-print:hover { opacity: .85; }
  .btn-close {
    background: #111827; color: #fff;
    border: none; border-radius: 8px;
    padding: 12px 18px;
    font-size: 14px; font-weight: 700; cursor: pointer;
  }
  .btn-close:hover { background: #374151; }

  @media print {
    body { background: #fff; }
    .no-print { display: none !important; }
    .print-wrapper { margin: 0; box-shadow: none; width: 100%; }
    @page { size: A5 portrait; margin: 0; }
  }
`;

export default function PrintFeeReceipt() {
  const { term } = useParams();
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const feesReq   = childId ? api.get(`/parents/child/${childId}/fees`) : api.get('/fees/my');
    const studentReq = childId
      ? api.get(`/students/${childId}`).catch(() => ({ data: null }))
      : api.get('/students/me').catch(() => ({ data: null }));

    Promise.all([feesReq, studentReq]).then(([feesRes, studentRes]) => {
      const fees = feesRes.data || [];
      const fee  = fees.find(f => String(f.semester) === String(term));
      if (!fee) { setError(`No fee record found for Term ${term}`); return; }
      setData({ fee, student: studentRes.data });
    }).catch(e => setError(e.response?.data?.message || 'Failed to load')).finally(() => setLoading(false));
  }, [term, childId]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'Roboto,sans-serif', color:'#6b7280' }}>
      Loading receipt…
    </div>
  );
  if (error) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'Roboto,sans-serif', color:'#ef4444' }}>
      {error}
    </div>
  );

  const { fee, student } = data;
  const balance = fee.totalAmount - fee.paidAmount;
  const today   = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const receiptNo = `FR-T${fee.semester}-${student?.admissionNo || '0000'}-${new Date().getFullYear()}`;

  const feeItems = [
    { label:'Tuition Fee',   amt: fee.tuitionFee  || 0 },
    { label:'Hostel Fee',    amt: fee.hostelFee   || 0 },
    { label:'Exam Fee',      amt: fee.examFee     || 0 },
    { label:'Other Charges', amt: fee.otherFee    || 0 },
  ].filter(i => i.amt > 0);

  const statusClass = fee.status === 'paid' ? 'status-paid' : fee.status === 'partial' ? 'status-partial' : 'status-unpaid';

  return (
    <>
      <style>{style}</style>

      <div className="no-print">
        <button className="btn-close" onClick={() => window.close()}>✕ Close</button>
        <button className="btn-print" onClick={() => window.print()}>🖨 Print Receipt</button>
      </div>

      <div className="print-wrapper">
        {/* Header */}
        <div className="doc-header">
          <div className="school-emblem">ERP</div>
          <div className="school-info">
            <div className="school-name">Excellence School</div>
            <div className="school-sub">123 School Road, City · Tel: +91-98765-43210</div>
          </div>
        </div>
        <div className="orange-rule" />

        {/* Receipt title */}
        <div className="receipt-title">
          <div className="receipt-title-text">Fee Receipt — Term {fee.semester}</div>
          <div className="receipt-no">{receiptNo}</div>
        </div>

        {/* Status ribbon */}
        <div className={`status-ribbon ${statusClass}`}>
          {fee.status === 'paid' ? '✓ Fully Paid' : fee.status === 'partial' ? '⚠ Partially Paid' : '✗ Payment Due'}
        </div>

        {/* Student info */}
        <div className="section-title">Student Details</div>
        <div className="student-box">
          <div className="student-box-header">Student Information</div>
          {[
            ['Student',       student?.user?.name || '—'],
            ['Admission No',  student?.admissionNo || '—'],
            ['Grade',         `Grade ${student?.grade || '—'} – Section ${student?.section || '—'}`],
            ['Academic Year', fee.academicYear || student?.academicYear || '—'],
            ['Date Issued',   today],
          ].map(([k, v]) => (
            <div key={k} className="student-row">
              <div className="student-key">{k}</div>
              <div className="student-val">{v}</div>
            </div>
          ))}
        </div>

        {/* Fee breakdown */}
        <div className="section-title">Fee Breakdown</div>
        <table className="fee-table">
          <tbody>
            {feeItems.map(item => (
              <tr key={item.label}>
                <td>{item.label}</td>
                <td>₹{item.amt.toLocaleString('en-IN')}</td>
              </tr>
            ))}
            <tr className="fee-divider fee-total">
              <td>Total Amount</td>
              <td>₹{fee.totalAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr style={{background:'#f0fdf4'}}>
              <td style={{color:'#166534', fontWeight:600}}>Amount Paid</td>
              <td style={{color:'#166534', fontWeight:600}}>₹{fee.paidAmount.toLocaleString('en-IN')}</td>
            </tr>
            <tr className={`fee-balance ${balance > 0 ? 'due' : 'clear'}`}>
              <td>Balance Due</td>
              <td>₹{balance.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        {/* Transaction history */}
        {fee.transactions?.length > 0 && (
          <>
            <div className="section-title" style={{marginTop:14}}>Payment History</div>
            <table className="txn-table">
              <thead>
                <tr><th>Date</th><th>Amount</th><th>Method</th><th>Reference</th></tr>
              </thead>
              <tbody>
                {fee.transactions.map((t, i) => (
                  <tr key={i}>
                    <td>{new Date(t.date).toLocaleDateString('en-IN')}</td>
                    <td style={{color:'#166534', fontWeight:600}}>₹{t.amount?.toLocaleString('en-IN')}</td>
                    <td>{t.method}</td>
                    <td style={{fontFamily:'monospace'}}>{t.reference || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Due date note */}
        {balance > 0 && fee.dueDate && (
          <div style={{margin:'12px 22px', padding:'8px 12px', background:'#fff7ed', border:'1px solid #fed7aa', borderRadius:4, fontSize:10, color:'#92400e'}}>
            ⚠ Payment due by: <strong>{new Date(fee.dueDate).toLocaleDateString('en-IN', {day:'2-digit', month:'long', year:'numeric'})}</strong>
          </div>
        )}

        {/* Signatures */}
        <div className="sig-row">
          <div className="sig-block">
            <div className="sig-line" />
            <div className="sig-label">Cashier</div>
          </div>
          <div className="sig-block">
            <div className="sig-line" />
            <div className="sig-label">Accounts Head</div>
          </div>
          <div className="sig-block">
            <div className="sig-line" />
            <div className="sig-label">Parent / Guardian</div>
          </div>
        </div>

        {/* Footer */}
        <div className="doc-footer">
          <div>
            <div className="footer-note">This is a computer-generated receipt.</div>
            <div className="footer-note">Excellence School · Printed on {today}</div>
            <div className="footer-note">Please retain for your records.</div>
          </div>
          <div className="school-stamp">School<br/>Seal</div>
        </div>
      </div>
    </>
  );
}
