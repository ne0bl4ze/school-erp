import { useEffect, useState } from 'react';
import api from '../services/api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

export default function TimeTable() {
  const [timetable, setTimetable] = useState(null);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    api.get('/timetable/my').then(r => setTimetable(r.data)).finally(() => setLoading(false));
  }, []);

  const downloadPDF = () => window.open('/api/pdf/timetable', '_blank');

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  const byDay = {};
  DAYS.forEach(d => { byDay[d] = []; });
  (timetable?.slots || []).forEach(s => {
    if (byDay[s.day]) byDay[s.day].push(s);
    DAYS.forEach(d => byDay[d].sort((a,b) => a.startTime.localeCompare(b.startTime)));
  });

  return (
    <div className="page fade-up">
      <div className="page-title">
        Time <span>Table</span>
        <button className="btn btn-ghost btn-sm" style={{ marginLeft:'auto' }} onClick={downloadPDF}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Print PDF
        </button>
      </div>

      <div className="card">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)' }}>
          {DAYS.map(day => (
            <div key={day} style={{ borderRight:'1px solid #2C2C2C' }}>
              <div style={{ padding:'10px 14px', background:'#000', borderBottom:'1px solid #2C2C2C', fontSize:11, fontWeight:700, letterSpacing:1, textTransform:'uppercase', color:'#DF740C', textAlign:'center' }}>
                {day}
              </div>
              {byDay[day].length === 0 ? (
                <div style={{ padding:20, textAlign:'center', fontSize:12, color:'#606060' }}>Free</div>
              ) : (
                byDay[day].map((slot, i) => (
                  <div key={i} style={{ padding:'12px 14px', borderBottom:'1px solid #2C2C2C', transition:'background 0.12s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#222'}
                    onMouseLeave={e=>e.currentTarget.style.background='transparent'}
                  >
                    <div style={{ fontSize:10, fontWeight:600, color:'#DF740C', marginBottom:5 }}>
                      {slot.startTime} – {slot.endTime}
                    </div>
                    <div style={{ fontSize:12, fontWeight:600, color:'#fff', marginBottom:3, lineHeight:1.3 }}>
                      {slot.course?.name}
                    </div>
                    <div style={{ fontSize:10, color:'#606060' }}>{slot.room}</div>
                    <span style={{ display:'inline-block', marginTop:4, fontSize:9, fontWeight:700, padding:'1px 6px', borderRadius:4, background: slot.type==='lab' ? 'rgba(59,130,246,0.12)' : 'rgba(223,116,12,0.12)', color: slot.type==='lab' ? '#3B82F6' : '#DF740C', textTransform:'uppercase', letterSpacing:0.5 }}>
                      {slot.type}
                    </span>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
