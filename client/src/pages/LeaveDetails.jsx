import { useEffect, useState } from 'react';
import api from '../services/api';

const STATUS_COLOR = { pending:'orange', approved:'green', rejected:'red' };

export default function LeaveDetails() {
  const [leaves,  setLeaves]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type:'medical', from:'', to:'', reason:'' });

  const load = () => api.get('/leave/my').then(r => setLeaves(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post('/leave', form);
    setShowForm(false); setForm({ type:'medical', from:'', to:'', reason:'' });
    load();
  };

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  return (
    <div className="page fade-up">
      <div className="page-title">
        Leave <span>Applications</span>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={() => setShowForm(v=>!v)}>
          + Apply Leave
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom:18, padding:20 }}>
          <form onSubmit={submit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="form-group">
                <label className="form-label">Leave Type</label>
                <select className="form-input" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  <option value="medical">Medical</option>
                  <option value="personal">Personal</option>
                  <option value="family">Family</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group" />
              <div className="form-group">
                <label className="form-label">From Date</label>
                <input className="form-input" type="date" value={form.from} onChange={e=>setForm(f=>({...f,from:e.target.value}))} required />
              </div>
              <div className="form-group">
                <label className="form-label">To Date</label>
                <input className="form-input" type="date" value={form.to} onChange={e=>setForm(f=>({...f,to:e.target.value}))} required />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label className="form-label">Reason</label>
                <textarea className="form-input" rows={3} value={form.reason} onChange={e=>setForm(f=>({...f,reason:e.target.value}))} required style={{ resize:'vertical' }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button type="submit" className="btn btn-primary btn-sm">Submit</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span className="card-title">My Applications</span>
        </div>
        <table>
          <thead><tr><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th><th>Remarks</th></tr></thead>
          <tbody>
            {leaves.map(l => {
              const days = Math.ceil((new Date(l.to) - new Date(l.from)) / 86400000) + 1;
              return (
                <tr key={l._id}>
                  <td><span className="badge badge-muted">{l.type}</span></td>
                  <td>{new Date(l.from).toLocaleDateString()}</td>
                  <td>{new Date(l.to).toLocaleDateString()}</td>
                  <td style={{ color:'#fff', fontWeight:600 }}>{days}</td>
                  <td style={{ maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{l.reason}</td>
                  <td><span className={`badge badge-${STATUS_COLOR[l.status]}`}>{l.status}</span></td>
                  <td>{l.remarks || '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {leaves.length === 0 && <div className="empty-state">No leave applications yet</div>}
      </div>
    </div>
  );
}
