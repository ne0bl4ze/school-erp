import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ChildFees() {
  const { profile } = useAuth();
  const children = profile?.children || [];
  const [selIdx, setSelIdx] = useState(0);
  const [fees,   setFees]   = useState([]);
  const [loading,setLoading]= useState(true);

  const child = children[selIdx];

  useEffect(() => {
    if (!child?._id) { setLoading(false); return; }
    setLoading(true);
    api.get(`/parents/child/${child._id}/fees`).then(r => setFees(r.data)).finally(() => setLoading(false));
  }, [child?._id]);

  const total   = fees.reduce((a,f)=>a+f.totalAmount,0);
  const paid    = fees.reduce((a,f)=>a+f.paidAmount, 0);

  return (
    <div className="page fade-up">
      <div className="page-title">Child's <span>Fees</span></div>
      {children.length>1 && (
        <div style={{ display:'flex', gap:8, marginBottom:18 }}>
          {children.map((c,i) => <button key={c._id} className={`btn btn-sm ${selIdx===i?'btn-primary':'btn-ghost'}`} onClick={()=>setSelIdx(i)}>{c.user?.name}</button>)}
        </div>
      )}
      {loading ? <div className="empty-state">Loading…</div> : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:20 }}>
            {[
              { l:'Total Fees',   v:`₹${total.toLocaleString()}`,     c:'#A0A0A0' },
              { l:'Paid',         v:`₹${paid.toLocaleString()}`,      c:'#22C55E' },
              { l:'Balance Due',  v:`₹${(total-paid).toLocaleString()}`, c:(total-paid)>0?'#EF4444':'#22C55E' },
            ].map(({ l,v,c }) => (
              <div key={l} className="card" style={{ padding:'20px 18px', textAlign:'center' }}>
                <div style={{ fontSize:10, fontWeight:700, color:'#606060', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>{l}</div>
                <div style={{ fontSize:28, fontWeight:700, color:c }}>{v}</div>
              </div>
            ))}
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Term-wise Fees</span></div>
            <table>
              <thead><tr><th>Term</th><th>Tuition</th><th>Hostel</th><th>Total</th><th>Paid</th><th>Balance</th><th>Status</th></tr></thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f._id}>
                    <td style={{ color:'#fff', fontWeight:600 }}>Term {f.semester}</td>
                    <td>₹{f.tuitionFee?.toLocaleString()}</td>
                    <td>₹{(f.hostelFee||0).toLocaleString()}</td>
                    <td style={{ fontWeight:600, color:'#fff' }}>₹{f.totalAmount?.toLocaleString()}</td>
                    <td style={{ color:'#22C55E' }}>₹{f.paidAmount?.toLocaleString()}</td>
                    <td style={{ color:(f.totalAmount-f.paidAmount)>0?'#EF4444':'#22C55E' }}>₹{(f.totalAmount-f.paidAmount).toLocaleString()}</td>
                    <td><span className={`badge badge-${f.status==='paid'?'green':f.status==='partial'?'orange':'red'}`}>{f.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fees.length===0 && <div className="empty-state">No fee records found</div>}
          </div>
        </>
      )}
    </div>
  );
}
