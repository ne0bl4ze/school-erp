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

  const printTimetable = () => {
    if (!child) return;
    window.open(`/print/timetable?childId=${child._id}`, '_blank');
  };

  return (
    <div className="page fade-up">
      <div className="page-title">
        Child's <span>Timetable</span>
        {timetable && (
          <button className="btn btn-ghost btn-sm" style={{ marginLeft:'auto' }} onClick={printTimetable}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Timetable
          </button>
        )}
      </div>

      {children.length > 1 && (
        <div style={{ display:'flex', gap:8, marginBottom:18 }}>
          {children.map((c,i) => (
            <button key={c._id} className={`btn btn-sm ${selIdx===i?'btn-primary':'btn-ghost'}`} onClick={()=>setSelIdx(i)}>
              {c.user?.name}
            </button>
          ))}
        </div>
      )}

      {loading ? <div className="empty-state">Loading…</div> : !timetable ? (
        <div className="card"><div className="empty-state">No timetable available for this class yet.</div></div>
      ) : (
        <>
          {/* Child info strip */}
          <div style={{ background:'#111', border:'1px solid #2C2C2C', borderRadius:8, padding:'10px 16px', marginBottom:14, fontSize:12, color:'#A0A0A0', display:'flex', gap:20 }}>
            <span><strong style={{ color:'#fff' }}>{child?.user?.name}</strong></span>
            <span>Grade {child?.grade} – Section {child?.section}</span>
            <span>AY {child?.academicYear}</span>
            <span style={{ color:'#DF740C' }}>Class Teacher: {child?.classTeacher?.name || '—'}</span>
          </div>

          <div className="card">
            <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)' }}>
              {DAYS.map(day => (
                <div key={day} style={{ borderRight:'1px solid #2C2C2C' }}>
                  <div style={{ padding:'10px 14px', background:'#000', borderBottom:'1px solid #2C2C2C', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#DF740C', textAlign:'center' }}>{day}</div>
                  {byDay[day].length === 0 ? (
                    <div style={{ padding:20, textAlign:'center', fontSize:12, color:'#606060' }}>Free</div>
                  ) : (
                    byDay[day].map((slot,i) => (
                      <div key={i} style={{ padding:'12px 14px', borderBottom:'1px solid #2C2C2C', transition:'background .15s' }}
                        onMouseEnter={e=>e.currentTarget.style.background='#222'}
                        onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                      >
                        <div style={{ fontSize:10, fontWeight:600, color:'#DF740C', marginBottom:4 }}>{slot.startTime} – {slot.endTime}</div>
                        <div style={{ fontSize:12, fontWeight:600, color:'#fff', marginBottom:3, lineHeight:1.3 }}>{slot.course?.name}</div>
                        <div style={{ fontSize:10, color:'#606060' }}>{slot.room}</div>
                        {slot.type === 'lab' && <div style={{ fontSize:9, color:'#3B82F6', marginTop:2, fontWeight:600 }}>LAB</div>}
                      </div>
                    ))
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
