import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const [data,      setData]     = useState({ records:[], summary:[] });
  const [loading,   setLoading]  = useState(true);
  const [students,  setStudents] = useState([]);
  const [selSubject,setSubject]  = useState('');
  const [date,      setDate]     = useState(new Date().toISOString().slice(0,10));
  const [marks,     setMarks]    = useState({});
  const [saving,    setSaving]   = useState(false);
  const [saved,     setSaved]    = useState(false);

  useEffect(() => {
    if (user.role === 'student') {
      api.get('/attendance/my').then(r => setData(r.data)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user.role]);

  useEffect(() => {
    if (user.role !== 'student' && selSubject) {
      api.get('/students').then(r => {
        setStudents(r.data);
        const init = {};
        r.data.forEach(s => { init[s._id] = 'present'; });
        setMarks(init);
      });
    }
  }, [selSubject, user.role]);

  const submit = async () => {
    setSaving(true);
    const records = Object.entries(marks).map(([studentId, status]) => ({ studentId, status }));
    await api.post('/attendance/mark', { courseId: selSubject, date, records });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  if (user.role === 'student') {
    return (
      <div className="page fade-up">
        <div className="page-title">Attendance <span>Summary</span></div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:10, marginBottom:20 }}>
          {data.summary.map(s => {
            const pct   = s.total ? ((s.present / s.total) * 100).toFixed(1) : 0;
            const color = pct >= 75 ? '#22C55E' : pct >= 60 ? '#DF740C' : '#EF4444';
            return (
              <div key={s.course._id} className="card" style={{ padding:16 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'#A0A0A0', marginBottom:4, textTransform:'uppercase', letterSpacing:0.5 }}>{s.course.code}</div>
                <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:12, lineHeight:1.3 }}>{s.course.name}</div>
                <div style={{ fontSize:28, fontWeight:700, color, marginBottom:4 }}>{pct}%</div>
                <div style={{ fontSize:11, color:'#606060' }}>{s.present}/{s.total} periods</div>
                <div style={{ height:3, background:'#2C2C2C', borderRadius:2, marginTop:10 }}>
                  <div style={{ height:'100%', width:`${pct}%`, background:color, borderRadius:2, transition:'width 0.5s' }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
            <span className="card-title">Period-wise Records</span>
          </div>
          <table>
            <thead><tr><th>Date</th><th>Subject</th><th>Status</th></tr></thead>
            <tbody>
              {data.records.slice(0,50).map((r,i) => (
                <tr key={i}>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.course?.name}</td>
                  <td><span className={`badge badge-${r.status==='present'?'green':r.status==='late'?'orange':'red'}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {data.records.length === 0 && <div className="empty-state">No records found</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-up">
      <div className="page-title">Mark <span>Attendance</span></div>
      <div className="card" style={{ marginBottom:18, padding:20 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Subject ID</label>
            <input className="form-input" placeholder="Enter Subject ID" value={selSubject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div className="form-group" style={{ margin:0 }}>
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Students — Mark Status</span>
            <div className="card-actions">
              <button className="btn btn-primary btn-sm" onClick={submit} disabled={saving}>
                {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save Attendance'}
              </button>
            </div>
          </div>
          <table>
            <thead><tr><th>Student</th><th>Admission No</th><th>Status</th></tr></thead>
            <tbody>
              {students.map(s => (
                <tr key={s._id}>
                  <td style={{ color:'#fff', fontWeight:500 }}>{s.user?.name}</td>
                  <td>{s.admissionNo}</td>
                  <td>
                    <select className="form-input" style={{ width:120, padding:'5px 10px' }}
                      value={marks[s._id] || 'present'}
                      onChange={e => setMarks(m => ({ ...m, [s._id]: e.target.value }))}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
