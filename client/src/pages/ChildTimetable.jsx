import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

export default function ChildTimetable() {
  const { profile } = useAuth();
  const children = profile?.children || [];
  const [selIdx, setSelIdx]     = useState(0);
  const [timetable, setTimetable]= useState(null);
  const [loading,   setLoading]  = useState(true);

  const child = children[selIdx];

  useEffect(() => {
    if (!child?._id) { setLoading(false); return; }
    setLoading(true);
    api.get(`/parents/child/${child._id}/timetable`).then(r => setTimetable(r.data)).finally(() => setLoading(false));
  }, [child?._id]);

  const byDay = {};
  DAYS.forEach(d => { byDay[d] = []; });
  (timetable?.slots || []).forEach(s => { if (byDay[s.day]) byDay[s.day].push(s); });
  DAYS.forEach(d => byDay[d].sort((a,b) => a.startTime.localeCompare(b.startTime)));

  return (
    <div className="page fade-up">
      <div className="page-title">Child's <span>Timetable</span></div>
      {children.length>1 && (
        <div style={{ display:'flex', gap:8, marginBottom:18 }}>
          {children.map((c,i) => <button key={c._id} className={`btn btn-sm ${selIdx===i?'btn-primary':'btn-ghost'}`} onClick={()=>setSelIdx(i)}>{c.user?.name}</button>)}
        </div>
      )}
      {loading ? <div className="empty-state">Loading…</div> : (
        <div className="card">
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)' }}>
            {DAYS.map(day => (
              <div key={day} style={{ borderRight:'1px solid #2C2C2C' }}>
                <div style={{ padding:'10px 14px', background:'#000', borderBottom:'1px solid #2C2C2C', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#DF740C', textAlign:'center' }}>{day}</div>
                {byDay[day].length===0 ? (
                  <div style={{ padding:20, textAlign:'center', fontSize:12, color:'#606060' }}>Free</div>
                ) : (
                  byDay[day].map((slot,i) => (
                    <div key={i} style={{ padding:'12px 14px', borderBottom:'1px solid #2C2C2C' }}
                      onMouseEnter={e=>e.currentTarget.style.background='#222'}
                      onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                    >
                      <div style={{ fontSize:10, fontWeight:600, color:'#DF740C', marginBottom:5 }}>{slot.startTime} – {slot.endTime}</div>
                      <div style={{ fontSize:12, fontWeight:600, color:'#fff', marginBottom:3, lineHeight:1.3 }}>{slot.course?.name}</div>
                      <div style={{ fontSize:10, color:'#606060' }}>{slot.room}</div>
                    </div>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
