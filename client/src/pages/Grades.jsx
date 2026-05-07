import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const GRADE_COLOR = { 'A+':'#22C55E', A:'#22C55E', 'B+':'#DF740C', B:'#DF740C', C:'#3B82F6', D:'#A0A0A0', F:'#EF4444' };

export default function Grades() {
  const { user } = useAuth();
  const [grades,       setGrades]      = useState([]);
  const [yearSummary,  setYearSummary] = useState([]);
  const [loading,      setLoading]     = useState(true);

  useEffect(() => {
    if (user.role === 'student') {
      api.get('/grades/my')
        .then(r => { setGrades(r.data.grades); setYearSummary(r.data.yearSummary); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user.role]);

  const downloadReportCard = (year) => window.open(`/api/pdf/report-card/${encodeURIComponent(year)}`, '_blank');
  // academicYear used as key throughout

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  const years = [...new Set(grades.map(g => g.academicYear))].sort();

  return (
    <div className="page fade-up">
      <div className="page-title">Report <span>Card</span></div>

      {/* Year summary cards */}
      {yearSummary.length > 0 && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10, marginBottom:20 }}>
          {yearSummary.map(s => (
            <div key={s.academicYear} className="card" style={{ padding:16, textAlign:'center' }}>
              <div style={{ fontSize:10, fontWeight:700, color:'#606060', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>AY {s.academicYear}</div>
              <div style={{ fontSize:32, fontWeight:800, color:'#DF740C' }}>{s.average}%</div>
              <div style={{ fontSize:11, color:'#606060', marginTop:2 }}>Overall</div>
            </div>
          ))}
        </div>
      )}

      {/* Per year tables */}
      {years.map(year => (
        <div key={year} className="card" style={{ marginBottom:18 }}>
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span className="card-title">Academic Year {year}</span>
            <div className="card-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => downloadReportCard(year)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Download Report Card
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Subject</th><th>Code</th>
                <th>Term 1</th><th>Term 2</th><th>Final Exam</th><th>Practical</th>
                <th>Avg %</th><th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {grades.filter(g => g.academicYear === year).map(g => (
                <tr key={g._id}>
                  <td style={{ color:'#fff', fontWeight:500 }}>{g.course?.name}</td>
                  <td style={{ fontSize:11, fontFamily:'monospace' }}>{g.course?.code}</td>
                  <td>{g.term1      ?? '—'}</td>
                  <td>{g.term2      ?? '—'}</td>
                  <td>{g.finalExam  ?? '—'}</td>
                  <td>{g.practical  ?? '—'}</td>
                  <td style={{ fontWeight:600, color:'#fff' }}>{g.percentage != null ? `${g.percentage}%` : '—'}</td>
                  <td>
                    <span className="badge" style={{ background:`${GRADE_COLOR[g.grade] || '#606060'}22`, color: GRADE_COLOR[g.grade] || '#606060' }}>
                      {g.grade ?? '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {grades.length === 0 && <div className="card"><div className="empty-state">No grades available yet</div></div>}
    </div>
  );
}
