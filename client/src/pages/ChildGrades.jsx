import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const GRADE_COLOR = { 'A+':'#22C55E', A:'#22C55E', 'B+':'#DF740C', B:'#DF740C', C:'#3B82F6', D:'#A0A0A0', F:'#EF4444' };

export default function ChildGrades() {
  const { profile } = useAuth();
  const children = profile?.children || [];
  const [selIdx, setSelIdx]     = useState(0);
  const [grades, setGrades]     = useState([]);
  const [summary,setSummary]    = useState([]);
  const [loading,setLoading]    = useState(true);

  const child = children[selIdx];

  useEffect(() => {
    if (!child?._id) { setLoading(false); return; }
    setLoading(true);
    api.get(`/parents/child/${child._id}/grades`).then(r => {
      setGrades(r.data.grades || []);
      setSummary(r.data.yearSummary || []);
    }).finally(() => setLoading(false));
  }, [child?._id]);

  const years = [...new Set(grades.map(g=>g.academicYear))].sort();

  return (
    <div className="page fade-up">
      <div className="page-title">Child's <span>Report Card</span></div>
      {children.length>1 && (
        <div style={{ display:'flex', gap:8, marginBottom:18 }}>
          {children.map((c,i) => <button key={c._id} className={`btn btn-sm ${selIdx===i?'btn-primary':'btn-ghost'}`} onClick={()=>setSelIdx(i)}>{c.user?.name}</button>)}
        </div>
      )}
      {loading ? <div className="empty-state">Loading…</div> : (
        <>
          {summary.length>0 && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10, marginBottom:20 }}>
              {summary.map(s => (
                <div key={s.academicYear} className="card" style={{ padding:16, textAlign:'center' }}>
                  <div style={{ fontSize:10, fontWeight:700, color:'#606060', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>AY {s.academicYear}</div>
                  <div style={{ fontSize:32, fontWeight:800, color:'#DF740C' }}>{s.average}%</div>
                  <div style={{ fontSize:11, color:'#606060', marginTop:2 }}>Average</div>
                </div>
              ))}
            </div>
          )}
          {years.map(year => (
            <div key={year} className="card" style={{ marginBottom:18 }}>
              <div className="card-header"><span className="card-title">Academic Year {year}</span></div>
              <table>
                <thead><tr><th>Subject</th><th>Term 1</th><th>Term 2</th><th>Final</th><th>Practical</th><th>Avg %</th><th>Grade</th></tr></thead>
                <tbody>
                  {grades.filter(g=>g.academicYear===year).map(g => (
                    <tr key={g._id}>
                      <td style={{ color:'#fff', fontWeight:500 }}>{g.course?.name}</td>
                      <td>{g.term1 ?? '—'}</td><td>{g.term2 ?? '—'}</td>
                      <td>{g.finalExam ?? '—'}</td><td>{g.practical ?? '—'}</td>
                      <td style={{ fontWeight:600, color:'#fff' }}>{g.percentage!=null?`${g.percentage}%`:'—'}</td>
                      <td><span className="badge" style={{ background:`${GRADE_COLOR[g.grade]||'#606060'}22`, color:GRADE_COLOR[g.grade]||'#606060' }}>{g.grade||'—'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {grades.length===0 && <div className="card"><div className="empty-state">No grades available yet</div></div>}
        </>
      )}
    </div>
  );
}
