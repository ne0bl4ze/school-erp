import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Syllabus() {
  const [subjects, setSubjects] = useState([]);
  const [open,     setOpen]     = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    api.get('/timetable/my').then(r => {
      const uniq = [];
      const seen = new Set();
      (r.data?.slots || []).forEach(s => {
        if (s.course && !seen.has(s.course._id)) {
          seen.add(s.course._id);
          uniq.push(s.course);
        }
      });
      setSubjects(uniq);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  return (
    <div className="page fade-up">
      <div className="page-title">Subject <span>Syllabus</span></div>
      {subjects.length === 0 && <div className="card"><div className="empty-state">No subjects found for this class</div></div>}
      {subjects.map(s => (
        <div key={s._id} className="card" style={{ marginBottom:10 }}>
          <div
            style={{ padding:'14px 18px', display:'flex', alignItems:'center', gap:12, cursor:'pointer', background: open===s._id ? '#222' : 'transparent' }}
            onClick={() => setOpen(o => o===s._id ? null : s._id)}
          >
            <div style={{ width:36, height:36, borderRadius:8, background:'rgba(223,116,12,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:800, color:'#DF740C', textAlign:'center', flexShrink:0 }}>
              {s.code?.slice(3,6)}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#fff' }}>{s.name}</div>
              <div style={{ fontSize:11, color:'#606060', marginTop:2 }}>Subject Code: {s.code}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#606060" strokeWidth="2" style={{ transform: open===s._id ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          {open === s._id && (
            <div style={{ borderTop:'1px solid #2C2C2C', padding:'14px 18px' }}>
              {(s.syllabus || []).length === 0 ? (
                <div style={{ fontSize:13, color:'#606060' }}>Syllabus not uploaded yet.</div>
              ) : (
                s.syllabus.map((unit, i) => (
                  <div key={i} style={{ marginBottom:12 }}>
                    <div style={{ fontSize:11, fontWeight:700, color:'#DF740C', textTransform:'uppercase', letterSpacing:0.5, marginBottom:6 }}>
                      Chapter {i+1}: {unit.unit}
                    </div>
                    <ul style={{ paddingLeft:16 }}>
                      {(unit.topics || []).map((t, j) => (
                        <li key={j} style={{ fontSize:13, color:'#A0A0A0', marginBottom:3 }}>{t}</li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
