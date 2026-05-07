import { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Announcements() {
  const { user } = useAuth();
  const [list,     setList]     = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [comment,  setComment]  = useState({});
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState({ title:'', body:'', targetRole:'all', pinned:false });

  const load = () => api.get('/announcements').then(r => setList(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const postComment = async (id) => {
    if (!comment[id]?.trim()) return;
    await api.post(`/announcements/${id}/comment`, { text: comment[id] });
    setComment(c => ({ ...c, [id]: '' }));
    load();
  };

  const create = async (e) => {
    e.preventDefault();
    await api.post('/announcements', form);
    setShowForm(false);
    setForm({ title:'', body:'', targetRole:'all', pinned:false });
    load();
  };

  const remove = async (id) => {
    if (!confirm('Delete this notice?')) return;
    await api.delete(`/announcements/${id}`);
    load();
  };

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  const canPost = user.role === 'teacher' || user.role === 'admin';

  return (
    <div className="page fade-up">
      <div className="page-title">
        Notice <span>Board</span>
        {canPost && (
          <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={() => setShowForm(v => !v)}>
            + Post Notice
          </button>
        )}
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom:18, padding:20 }}>
          <form onSubmit={create}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label className="form-label">Title</label>
                <input className="form-input" value={form.title} onChange={e => setForm(f => ({ ...f, title:e.target.value }))} required />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label className="form-label">Message</label>
                <textarea className="form-input" rows={3} value={form.body} onChange={e => setForm(f => ({ ...f, body:e.target.value }))} required style={{ resize:'vertical' }} />
              </div>
              <div className="form-group">
                <label className="form-label">Target</label>
                <select className="form-input" value={form.targetRole} onChange={e => setForm(f => ({ ...f, targetRole:e.target.value }))}>
                  <option value="all">All</option>
                  <option value="student">Students</option>
                  <option value="teacher">Teachers</option>
                </select>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:8 }}>
              <button type="submit" className="btn btn-primary btn-sm">Post</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {list.length === 0 && <div className="card"><div className="empty-state">No notices posted yet</div></div>}

      {list.map(ann => (
        <div key={ann._id} className="card" style={{ marginBottom:12 }}>
          <div style={{ padding:'14px 18px' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10 }}>
              <div style={{ width:32, height:32, borderRadius:8, background:'rgba(223,116,12,0.12)', border:'1px solid rgba(223,116,12,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#DF740C', flexShrink:0 }}>
                {ann.author?.name?.slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  <span style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{ann.author?.name}</span>
                  {ann.pinned    && <span className="badge badge-orange">Pinned</span>}
                  {ann.targetRole !== 'all' && <span className="badge badge-muted">{ann.targetRole}s only</span>}
                  <span style={{ fontSize:10.5, color:'#606060', marginLeft:'auto' }}>{new Date(ann.createdAt).toLocaleString()}</span>
                </div>
              </div>
              {canPost && (
                <button onClick={() => remove(ann._id)} style={{ background:'transparent', border:'none', color:'#606060', cursor:'pointer', padding:4 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>
                </button>
              )}
            </div>

            <div style={{ fontSize:14, fontWeight:700, color:'#fff', marginBottom:6 }}>{ann.title}</div>
            <div style={{ fontSize:13, color:'#A0A0A0', lineHeight:1.6, marginBottom:12 }}>{ann.body}</div>

            {ann.comments?.length > 0 && (
              <div style={{ marginBottom:10, paddingLeft:12, borderLeft:'2px solid #2C2C2C' }}>
                {ann.comments.map((c, i) => (
                  <div key={i} style={{ fontSize:12, color:'#A0A0A0', marginBottom:4 }}>
                    <span style={{ color:'#DF740C', fontWeight:600 }}>{c.user?.name || 'User'}: </span>{c.text}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display:'flex', gap:8 }}>
              <input className="form-input" style={{ flex:1, padding:'7px 12px', fontSize:12.5 }}
                placeholder="Add a comment…"
                value={comment[ann._id] || ''}
                onChange={e => setComment(c => ({ ...c, [ann._id]: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && postComment(ann._id)}
              />
              <button className="btn btn-primary btn-sm" onClick={() => postComment(ann._id)}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
