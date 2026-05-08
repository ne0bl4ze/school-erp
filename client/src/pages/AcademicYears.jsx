import { useEffect, useState } from 'react';
import api from '../services/api';

export default function AcademicYears() {
  const [years,   setYears]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState({ name:'', startDate:'', endDate:'' });
  const [showForm,setShowForm]= useState(false);
  const [saving,  setSaving]  = useState(false);

  const load = () => api.get('/academic-years').then(r => setYears(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault(); setSaving(true);
    await api.post('/academic-years', form);
    setShowForm(false); setForm({ name:'', startDate:'', endDate:'' });
    load(); setSaving(false);
  };

  const activate = async (id) => {
    await api.put(`/academic-years/${id}/activate`);
    load();
  };

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  return (
    <div className="page fade-up">
      <div className="page-title">
        Academic <span>Years</span>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={() => setShowForm(v=>!v)}>+ New Year</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding:20, marginBottom:18 }}>
          <form onSubmit={create}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12 }}>
              <div className="form-group" style={{ margin:0 }}>
                <label className="form-label">Year Name (e.g. 2026-27)</label>
                <input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} required placeholder="2026-27" />
              </div>
              <div className="form-group" style={{ margin:0 }}>
                <label className="form-label">Start Date</label>
                <input className="form-input" type="date" value={form.startDate} onChange={e=>setForm(f=>({...f,startDate:e.target.value}))} />
              </div>
              <div className="form-group" style={{ margin:0 }}>
                <label className="form-label">End Date</label>
                <input className="form-input" type="date" value={form.endDate} onChange={e=>setForm(f=>({...f,endDate:e.target.value}))} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>{saving?'Saving…':'Create'}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span className="card-title">All Academic Years</span>
        </div>
        <table>
          <thead><tr><th>Year</th><th>Start Date</th><th>End Date</th><th>Status</th><th>Action</th></tr></thead>
          <tbody>
            {years.map(y => (
              <tr key={y._id}>
                <td style={{ color:'#fff', fontWeight:700, fontSize:15 }}>{y.name}</td>
                <td>{y.startDate ? new Date(y.startDate).toLocaleDateString() : '—'}</td>
                <td>{y.endDate   ? new Date(y.endDate).toLocaleDateString()   : '—'}</td>
                <td>{y.isCurrent ? <span className="badge badge-green">Current</span> : <span className="badge badge-muted">Past</span>}</td>
                <td>{!y.isCurrent && (
                  <button className="btn btn-ghost btn-sm" onClick={() => activate(y._id)}>Set as Current</button>
                )}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {years.length === 0 && <div className="empty-state">No academic years created yet</div>}
      </div>
    </div>
  );
}
