import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function StatCard({ value, label, color }) {
  const colors = { orange:'#DF740C', green:'#22C55E', red:'#EF4444', blue:'#3B82F6', teal:'#14B8A6' };
  const c = colors[color];
  return (
    <div style={{ background:'#181818', border:'1px solid #2C2C2C', borderRadius:10, padding:'18px 14px 14px', textAlign:'center', cursor:'pointer', position:'relative', overflow:'hidden', transition:'transform 0.15s' }}
      onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
      onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
    >
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:c, borderRadius:'0 0 10px 10px' }} />
      <div style={{ fontSize:26, fontWeight:700, color:'#fff', marginBottom:8 }}>{value}</div>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.9px', textTransform:'uppercase', color:c }}>{label}</div>
    </div>
  );
}

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [timetable,     setTimetable]     = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [attSummary,    setAttSummary]    = useState([]);
  const [comment,       setComment]       = useState({});

  useEffect(() => {
    api.get('/timetable/my').then(r => setTimetable(r.data)).catch(() => {});
    api.get('/announcements').then(r => setAnnouncements(r.data)).catch(() => {});
    api.get('/attendance/my').then(r => setAttSummary(r.data.summary || [])).catch(() => {});
  }, []);

  const today = DAYS[new Date().getDay()];
  const todaySlots = (timetable?.slots || [])
    .filter(s => s.day === today)
    .sort((a,b) => a.startTime.localeCompare(b.startTime));

  const overallAtt = attSummary.reduce((acc, s) => { acc.total += s.total; acc.present += s.present; return acc; }, { total:0, present:0 });
  const attPct = overallAtt.total ? ((overallAtt.present / overallAtt.total)*100).toFixed(1) : '—';

  const postComment = async (annId) => {
    if (!comment[annId]?.trim()) return;
    await api.post(`/announcements/${annId}/comment`, { text: comment[annId] });
    setComment(c => ({ ...c, [annId]:'' }));
    api.get('/announcements').then(r => setAnnouncements(r.data));
  };

  return (
    <div className="page fade-up">
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:20 }}>
        <StatCard value={announcements.length}    label="Notices"    color="orange" />
        <StatCard value={`${attPct}%`}            label="Attendance" color="green"  />
        <StatCard value={attSummary.length}        label="Subjects"   color="blue"   />
        <StatCard value={`Grade ${profile?.grade ?? '—'}`} label="Class" color="red" />
        <StatCard value={profile?.section ?? '—'} label="Section"    color="teal"   />
      </div>

      <div className="card" style={{ marginBottom:18 }}>
        <div className="card-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <span className="card-title">Today's Periods — {today}</span>
          <div className="card-actions"><Link to="/timetable" style={{ fontSize:11.5, fontWeight:500, color:'#DF740C' }}>Full Timetable →</Link></div>
        </div>
        {todaySlots.length === 0 ? (
          <div className="empty-state">No periods today</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(todaySlots.length,5)},1fr)` }}>
            {todaySlots.map((slot,i) => (
              <div key={i} style={{ padding:'16px 18px', borderRight:'1px solid #2C2C2C' }}
                onMouseEnter={e=>e.currentTarget.style.background='#222'}
                onMouseLeave={e=>e.currentTarget.style.background='transparent'}
              >
                <div style={{ fontSize:10.5, fontWeight:600, color:'#DF740C', marginBottom:7, display:'flex', alignItems:'center', gap:4 }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'#DF740C', display:'inline-block' }} />
                  {slot.startTime} – {slot.endTime}
                </div>
                <div style={{ fontSize:12.5, fontWeight:600, color:'#fff', marginBottom:5, lineHeight:1.35 }}>{slot.course?.name}</div>
                <span style={{ fontSize:10.5, color:'#606060', padding:'2px 7px', background:'#222', borderRadius:4 }}>{slot.room}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span className="card-title">Notice Board</span>
          <div className="card-actions"><Link to="/announcements" style={{ fontSize:11.5, fontWeight:500, color:'#DF740C' }}>View All →</Link></div>
        </div>
        {announcements.length === 0 ? <div className="empty-state">No notices yet</div> : (
          announcements.slice(0,3).map(ann => (
            <div key={ann._id} style={{ padding:'16px 18px', borderBottom:'1px solid #2C2C2C' }}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:'rgba(223,116,12,0.12)', border:'1px solid rgba(223,116,12,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#DF740C', flexShrink:0 }}>
                  {ann.author?.name?.slice(0,2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{ann.author?.name} <span style={{ fontWeight:400, color:'#606060' }}>posted</span></div>
                  <div style={{ fontSize:10.5, color:'#606060' }}>{new Date(ann.createdAt).toLocaleString()}</div>
                </div>
                {ann.pinned && <span className="badge badge-orange" style={{ marginLeft:'auto' }}>Pinned</span>}
              </div>
              <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:4 }}>{ann.title}</div>
              <div style={{ fontSize:12.5, color:'#A0A0A0', marginBottom:12, lineHeight:1.5 }}>{ann.body}</div>
              <div style={{ display:'flex', gap:8 }}>
                <input className="form-input" style={{ flex:1, padding:'7px 12px', fontSize:12.5 }} placeholder="Add a comment…"
                  value={comment[ann._id] || ''} onChange={e => setComment(c => ({ ...c, [ann._id]:e.target.value }))}
                  onKeyDown={e => e.key==='Enter' && postComment(ann._id)} />
                <button className="btn btn-primary btn-sm" onClick={() => postComment(ann._id)}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
