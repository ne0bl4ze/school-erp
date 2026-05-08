import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Promotions() {
  const [preview,   setPreview]   = useState([]);
  const [history,   setHistory]   = useState([]);
  const [fromGrade, setFromGrade] = useState('8');
  const [toGrade,   setToGrade]   = useState('9');
  const [fromYear,  setFromYear]  = useState('2025-26');
  const [toYear,    setToYear]    = useState('2026-27');
  const [marks,     setMarks]     = useState({});
  const [loading,   setLoading]   = useState(false);
  const [executing, setExecuting] = useState(false);
  const [done,      setDone]      = useState('');

  useEffect(() => {
    api.get('/promotions').then(r => setHistory(r.data));
  }, []);

  const doPreview = async () => {
    setLoading(true); setPreview([]);
    const r = await api.post('/promotions/preview', { fromGrade, academicYear: fromYear });
    setPreview(r.data);
    const init = {};
    r.data.forEach(s => { init[s._id] = { toGrade: String(toGrade), status:'promoted', remarks:'' }; });
    setMarks(init);
    setLoading(false);
  };

  const execute = async () => {
    setExecuting(true); setDone('');
    const records = preview.map(s => ({
      studentId: s._id,
      toGrade:   Number(marks[s._id]?.toGrade || toGrade),
      status:    marks[s._id]?.status || 'promoted',
      remarks:   marks[s._id]?.remarks,
    }));
    await api.post('/promotions/execute', { academicYear: fromYear, toAcademicYear: toYear, records });
    setDone(`✓ Promoted ${records.filter(r=>r.status==='promoted').length} students to Grade ${toGrade}`);
    setPreview([]); api.get('/promotions').then(r => setHistory(r.data));
    setExecuting(false);
  };

  return (
    <div className="page fade-up">
      <div className="page-title">Class <span>Promotions</span></div>

      <div className="card" style={{ padding:20, marginBottom:18 }}>
        <div style={{ fontSize:12, fontWeight:700, color:'#606060', textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>Configure Promotion</div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:14 }}>
          {[
            ['From Grade', fromGrade, setFromGrade],
            ['To Grade',   toGrade,   setToGrade],
            ['From Year',  fromYear,  setFromYear],
            ['To Year',    toYear,    setToYear],
          ].map(([label, val, setter]) => (
            <div className="form-group" key={label} style={{ margin:0 }}>
              <label className="form-label">{label}</label>
              <input className="form-input" value={val} onChange={e=>setter(e.target.value)} />
            </div>
          ))}
        </div>
        <button className="btn btn-primary" onClick={doPreview} disabled={loading}>{loading?'Loading…':'Preview Students'}</button>
      </div>

      {done && <div style={{ background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', borderRadius:8, padding:'12px 16px', marginBottom:16, fontSize:13, color:'#22C55E' }}>{done}</div>}

      {preview.length > 0 && (
        <div className="card" style={{ marginBottom:18 }}>
          <div className="card-header">
            <span className="card-title">Preview — {preview.length} students from Grade {fromGrade}</span>
            <div className="card-actions">
              <button className="btn btn-primary btn-sm" onClick={execute} disabled={executing}>
                {executing ? 'Executing…' : `🎓 Execute Promotion`}
              </button>
            </div>
          </div>
          <table>
            <thead><tr><th>Name</th><th>Admission No</th><th>Section</th><th>To Grade</th><th>Status</th></tr></thead>
            <tbody>
              {preview.map(s => (
                <tr key={s._id}>
                  <td style={{ color:'#fff', fontWeight:500 }}>{s.name}</td>
                  <td style={{ fontFamily:'monospace', fontSize:11 }}>{s.admissionNo}</td>
                  <td>{s.section}</td>
                  <td>
                    <input className="form-input" style={{ width:70, padding:'4px 8px' }}
                      value={marks[s._id]?.toGrade || toGrade}
                      onChange={e => setMarks(m=>({ ...m, [s._id]:{ ...m[s._id], toGrade:e.target.value } }))} />
                  </td>
                  <td>
                    <select className="form-input" style={{ width:110, padding:'4px 8px' }}
                      value={marks[s._id]?.status || 'promoted'}
                      onChange={e => setMarks(m=>({ ...m, [s._id]:{ ...m[s._id], status:e.target.value } }))}>
                      <option value="promoted">Promoted</option>
                      <option value="detained">Detained</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {history.length > 0 && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Promotion History</span>
          </div>
          <table>
            <thead><tr><th>Academic Year</th><th>Promoted By</th><th>Students</th><th>Date</th></tr></thead>
            <tbody>
              {history.map(h => (
                <tr key={h._id}>
                  <td style={{ color:'#fff', fontWeight:600 }}>{h.academicYear}</td>
                  <td>{h.promotedBy?.name || '—'}</td>
                  <td><span className="badge badge-blue">{h.records?.length || 0} students</span></td>
                  <td style={{ fontSize:11 }}>{new Date(h.promotedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
