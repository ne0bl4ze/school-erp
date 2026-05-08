import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

export default function ParentDashboard() {
  const { profile } = useAuth();
  const children = profile?.children || [];
  const [selIdx, setSelIdx]     = useState(0);
  const [attSummary, setAtt]    = useState([]);
  const [grades,     setGrades] = useState([]);
  const [fees,       setFees]   = useState([]);
  const [messages,   setMsgs]   = useState([]);
  const [timetable,  setTT]     = useState(null);
  const [loading,    setLoading]= useState(true);

  const child = children[selIdx];
  const childId = child?._id;

  useEffect(() => {
    if (!childId) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      api.get(`/parents/child/${childId}/attendance`).then(r => setAtt(r.data.summary || [])),
      api.get(`/parents/child/${childId}/grades`).then(r => setGrades(r.data.grades || [])),
      api.get(`/parents/child/${childId}/fees`).then(r => setFees(r.data || [])),
      api.get('/messages').then(r => setMsgs(r.data || [])),
      api.get(`/parents/child/${childId}/timetable`).then(r => setTT(r.data)),
    ]).finally(() => setLoading(false));
  }, [childId]);

  const overallAtt = attSummary.reduce((a,s)=>({ total:a.total+s.total, present:a.present+s.present }), { total:0, present:0 });
  const attPct = overallAtt.total ? ((overallAtt.present/overallAtt.total)*100).toFixed(1) : '—';
  const avgGrade = grades.length ? Math.round(grades.reduce((a,g)=>a+(g.percentage||0),0)/grades.length) : null;
  const feeStatus = fees.some(f=>f.status==='unpaid') ? '⚠ Due' : fees.some(f=>f.status==='partial') ? 'Partial' : fees.length ? 'Paid' : '—';
  const unreadMsgs = messages.filter(m => !m.read && m.recipient === profile?.user).length;

  const today = DAYS[new Date().getDay()];
  const todaySlots = (timetable?.slots||[]).filter(s=>s.day===today).sort((a,b)=>a.startTime.localeCompare(b.startTime));

  if (!children.length) return (
    <div className="page fade-up">
      <div className="page-title">Parent <span>Dashboard</span></div>
      <div className="card"><div className="empty-state">No children linked to your account. Contact the school admin.</div></div>
    </div>
  );

  return (
    <div className="page fade-up">
      <div className="page-title">Parent <span>Dashboard</span></div>

      {/* Child selector */}
      {children.length > 1 && (
        <div style={{ display:'flex', gap:8, marginBottom:18 }}>
          {children.map((c,i) => (
            <button key={c._id} className={`btn ${selIdx===i?'btn-primary':'btn-ghost'} btn-sm`} onClick={()=>setSelIdx(i)}>
              {c.user?.name || `Child ${i+1}`} · Grade {c.grade}
            </button>
          ))}
        </div>
      )}

      {loading ? <div className="empty-state">Loading…</div> : (
        <>
          {/* Child info card */}
          <div className="card" style={{ padding:'16px 20px', marginBottom:18, display:'flex', alignItems:'center', gap:16 }}>
            <div style={{ width:50, height:50, borderRadius:12, background:'linear-gradient(135deg,#DF740C,#7A3800)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:800, color:'#000', flexShrink:0 }}>
              {child?.user?.name?.slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{child?.user?.name}</div>
              <div style={{ fontSize:12, color:'#606060', marginTop:2 }}>
                Grade {child?.grade} – Section {child?.section} · {child?.admissionNo} · AY {child?.academicYear}
              </div>
              <div style={{ fontSize:11, color:'#DF740C', marginTop:2 }}>Class Teacher: {child?.classTeacher?.name || '—'}</div>
            </div>
          </div>

          {/* Stat cards */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:20 }}>
            {[
              { v:`${attPct}%`,       l:'Attendance',      c:'green'  },
              { v:avgGrade!=null?`${avgGrade}%`:'—', l:'Avg Grade', c:'blue' },
              { v:feeStatus,          l:'Fee Status',      c: fees.some(f=>f.status==='unpaid')?'red':'green' },
              { v:messages.length,    l:'Messages',        c:'orange' },
            ].map(({ v,l,c }) => {
              const col = { orange:'#DF740C', green:'#22C55E', red:'#EF4444', blue:'#3B82F6' }[c];
              return (
                <div key={l} style={{ background:'#181818', border:'1px solid #2C2C2C', borderRadius:10, padding:'16px 14px 12px', textAlign:'center', position:'relative', overflow:'hidden' }}>
                  <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:col }} />
                  <div style={{ fontSize:24, fontWeight:800, color:'#fff', marginBottom:6 }}>{v}</div>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.9px', textTransform:'uppercase', color:col }}>{l}</div>
                </div>
              );
            })}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
            {/* Today's schedule */}
            <div className="card">
              <div className="card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span className="card-title">Today's Schedule — {today}</span>
                <div className="card-actions"><Link to="/child-timetable" style={{ fontSize:11.5, fontWeight:500, color:'#DF740C' }}>Full →</Link></div>
              </div>
              {todaySlots.length === 0 ? <div className="empty-state">No periods today</div> : (
                todaySlots.map((s,i) => (
                  <div key={i} style={{ padding:'10px 16px', borderBottom:'1px solid #2C2C2C' }}>
                    <div style={{ fontSize:10, color:'#DF740C', fontWeight:600 }}>{s.startTime} – {s.endTime}</div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{s.course?.name}</div>
                    <div style={{ fontSize:10, color:'#606060' }}>{s.room}</div>
                  </div>
                ))
              )}
            </div>

            {/* Attendance summary */}
            <div className="card">
              <div className="card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                <span className="card-title">Attendance by Subject</span>
                <div className="card-actions"><Link to="/child-attendance" style={{ fontSize:11.5, fontWeight:500, color:'#DF740C' }}>Details →</Link></div>
              </div>
              {attSummary.map(s => {
                const pct = s.total ? ((s.present/s.total)*100).toFixed(0) : 0;
                const col = pct>=75?'#22C55E':pct>=60?'#DF740C':'#EF4444';
                return (
                  <div key={s.course._id} style={{ padding:'8px 16px', borderBottom:'1px solid #2C2C2C' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                      <span style={{ fontSize:12, color:'#A0A0A0' }}>{s.course.name}</span>
                      <span style={{ fontSize:12, fontWeight:700, color:col }}>{pct}%</span>
                    </div>
                    <div style={{ height:3, background:'#2C2C2C', borderRadius:2 }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:col, borderRadius:2 }} />
                    </div>
                  </div>
                );
              })}
              {!attSummary.length && <div className="empty-state">No attendance records yet</div>}
            </div>
          </div>

          {/* Fee alerts */}
          {fees.some(f=>f.status!=='paid') && (
            <div className="card" style={{ marginTop:18, border:'1px solid rgba(239,68,68,0.3)' }}>
              <div className="card-header">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                <span className="card-title" style={{ color:'#EF4444' }}>Fee Alerts</span>
                <div className="card-actions"><Link to="/child-fees" style={{ fontSize:11.5, fontWeight:500, color:'#DF740C' }}>Pay →</Link></div>
              </div>
              {fees.filter(f=>f.status!=='paid').map(f => (
                <div key={f._id} style={{ padding:'12px 18px', borderBottom:'1px solid #2C2C2C', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>Term {f.semester}</div>
                    <div style={{ fontSize:11, color:'#606060' }}>Due: {new Date(f.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:14, fontWeight:700, color:'#EF4444' }}>₹{(f.totalAmount-f.paidAmount).toLocaleString()}</div>
                    <span className={`badge badge-${f.status==='unpaid'?'red':'orange'}`}>{f.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Messages */}
          <div className="card" style={{ marginTop:18 }}>
            <div className="card-header">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              <span className="card-title">Messages</span>
              <div className="card-actions"><Link to="/parent-messages" style={{ fontSize:11.5, fontWeight:500, color:'#DF740C' }}>+ Compose →</Link></div>
            </div>
            {!messages.length ? <div className="empty-state">No messages yet. Start a conversation with the class teacher.</div> : (
              messages.slice(0,3).map(m => (
                <div key={m._id} style={{ padding:'12px 18px', borderBottom:'1px solid #2C2C2C', display:'flex', gap:10 }}>
                  <div style={{ width:28, height:28, borderRadius:6, background:'rgba(223,116,12,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color:'#DF740C', flexShrink:0 }}>
                    {(m.sender?.name||'?').slice(0,2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{m.sender?.name} {!m.read && <span className="badge badge-orange">New</span>}</div>
                    <div style={{ fontSize:11, color:'#606060' }}>{m.body?.slice(0,60)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
