import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Fees() {
  const [fees, setFees]     = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/fees/my').then(r => setFees(r.data)).finally(() => setLoading(false));
  }, []);

  const downloadReceipt = (sem) => window.open(`/api/pdf/fee-receipt/${sem}`, '_blank');

  const total   = fees.reduce((a, f) => a + f.totalAmount, 0);
  const paid    = fees.reduce((a, f) => a + f.paidAmount,  0);
  const balance = total - paid;

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  return (
    <div className="page fade-up">
      <div className="page-title">Fees <span>Details</span></div>

      {/* Summary */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
        {[
          { label:'Total Fees',  value:`₹${total.toLocaleString()}`,   color:'#A0A0A0' },
          { label:'Paid',        value:`₹${paid.toLocaleString()}`,    color:'#22C55E' },
          { label:'Balance Due', value:`₹${balance.toLocaleString()}`, color: balance > 0 ? '#EF4444' : '#22C55E' },
        ].map(c => (
          <div key={c.label} className="card" style={{ padding:'20px 18px', textAlign:'center' }}>
            <div style={{ fontSize:10, fontWeight:700, color:'#606060', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>{c.label}</div>
            <div style={{ fontSize:28, fontWeight:700, color:c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Fee Records */}
      <div className="card">
        <div className="card-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span className="card-title">Semester-wise Fees</span>
        </div>
        <table>
          <thead>
            <tr><th>Semester</th><th>Tuition</th><th>Hostel</th><th>Exam</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th><th>Receipt</th></tr>
          </thead>
          <tbody>
            {fees.map(f => (
              <tr key={f._id}>
                <td style={{ color:'#fff', fontWeight:600 }}>Term {f.semester}</td>
                <td>₹{f.tuitionFee?.toLocaleString()}</td>
                <td>₹{(f.hostelFee || 0).toLocaleString()}</td>
                <td>₹{(f.examFee   || 0).toLocaleString()}</td>
                <td style={{ fontWeight:600, color:'#fff' }}>₹{f.totalAmount?.toLocaleString()}</td>
                <td style={{ color:'#22C55E' }}>₹{f.paidAmount?.toLocaleString()}</td>
                <td style={{ color: (f.totalAmount - f.paidAmount) > 0 ? '#EF4444' : '#22C55E' }}>
                  ₹{(f.totalAmount - f.paidAmount).toLocaleString()}
                </td>
                <td>
                  <span className={`badge badge-${f.status === 'paid' ? 'green' : f.status === 'partial' ? 'orange' : 'red'}`}>
                    {f.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-ghost btn-sm" onClick={() => downloadReceipt(f.semester)}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {fees.length === 0 && <div className="empty-state">No fee records found</div>}
      </div>

      {/* Transaction history */}
      {fees.some(f => f.transactions?.length > 0) && (
        <div className="card" style={{ marginTop:18 }}>
          <div className="card-header">
            <span className="card-title">Transaction History</span>
          </div>
          <table>
            <thead><tr><th>Semester</th><th>Amount</th><th>Method</th><th>Reference</th><th>Date</th></tr></thead>
            <tbody>
              {fees.flatMap(f =>
                (f.transactions || []).map((t, i) => (
                  <tr key={`${f._id}-${i}`}>
                    <td>Term {f.semester}</td>
                    <td style={{ color:'#22C55E', fontWeight:600 }}>₹{t.amount?.toLocaleString()}</td>
                    <td><span className="badge badge-blue">{t.method}</span></td>
                    <td style={{ fontFamily:'monospace', fontSize:12 }}>{t.reference || '—'}</td>
                    <td>{new Date(t.date).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
