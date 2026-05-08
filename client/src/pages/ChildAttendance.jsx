import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ChildAttendance() {
  const { profile } = useAuth();
  const children = profile?.children || [];
  const [selIdx, setSelIdx]   = useState(0);
  const [data,   setData]     = useState({ records:[], summary:[] });
  const [loading,setLoading]  = useState(true);

  const child = children[selIdx];

  useEffect(() => {
    if (!child?._id) { setLoading(false); return; }
    setLoading(true);
    api.get(`/parents/child/${child._id}/attendance`).then(r => setData(r.data)).finally(() => setLoading(false));
  }, [child?._id]);

  return (
    <div className="page fade-up">
      <div className="page-title">Child's <span>Attendance</span></div>
      {children.length > 1 && (
        <div style={{ display:'flex', gap:8, marginBottom:18 }}>
          {children.map((c,i) => <button key={c._id} className={`btn btn-sm ${selIdx===i?'btn-primary':'btn-ghost'}`} onClick={()=>setSelIdx(i)}>{c.user?.name}</button>)}
        </div>
      )}
      {loading ? <div className="empty-state">Loading…</div> : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10, marginBottom:20 }}>
            {data.summary.map(s => {
              const pct = s.total ? ((s.present/s.total)*100).toFixed(1) : 0;
              const color = pct>=75?'#22C55E':pct>=60?'#DF740C':'#EF4444';
              return (
                <div key={s.course._id} className="card" style={{ padding:16 }}>
                  <div style={{ fontSize:11, fontWeight:700, color:'#A0A0A0', marginBottom:4, textTransform:'uppercase' }}>{s.course.code}</div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:10 }}>{s.course.name}</div>
                  <div style={{ fontSize:28, fontWeight:700, color, marginBottom:4 }}>{pct}%</div>
                  <div style={{ fontSize:11, color:'#606060' }}>{s.present}/{s.total} periods</div>
                  <div style={{ height:3, background:'#2C2C2C', borderRadius:2, marginTop:10 }}>
                    <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2 }} />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="card">
            <div className="card-header"><span className="card-title">Detailed Records</span></div>
            <table>
              <thead><tr><th>Date</th><th>Subject</th><th>Status</th></tr></thead>
              <tbody>
                {data.records.slice(0,30).map((r,i) => (
                  <tr key={i}>
                    <td>{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.course?.name}</td>
                    <td><span className={`badge badge-${r.status==='present'?'green':r.status==='late'?'orange':'red'}`}>{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.records.length===0 && <div className="empty-state">No records yet</div>}
          </div>
        </>
      )}
    </div>
  );
}
