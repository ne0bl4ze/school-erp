import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ParentMessages() {
  const { user, profile } = useAuth();
  const children = profile?.children || [];
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [compose,  setCompose]  = useState({ recipientId:'', studentId:'', subject:'', body:'' });
  const [showForm, setShowForm] = useState(false);
  const [sending,  setSending]  = useState(false);
  const [reply,    setReply]    = useState({});

  const load = () => api.get('/messages').then(r => setMessages(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  // Pre-fill teacher for first child
  useEffect(() => {
    if (children[0]?.classTeacher) {
      setCompose(c => ({ ...c, recipientId: children[0].classTeacher._id || '', studentId: children[0]._id || '' }));
    }
  }, [profile]);

  const send = async (e) => {
    e.preventDefault(); setSending(true);
    await api.post('/messages', compose);
    setShowForm(false); setCompose(c => ({ ...c, subject:'', body:'' }));
    setSending(false); load();
  };

  const sendReply = async (msg) => {
    if (!reply[msg._id]?.trim()) return;
    const recipientId = msg.sender._id === user._id ? msg.recipient._id : msg.sender._id;
    await api.post('/messages', { recipientId, studentId: msg.student?._id, body: reply[msg._id], replyTo: msg._id });
    setReply(r => ({ ...r, [msg._id]:'' }));
    load();
  };

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  return (
    <div className="page fade-up">
      <div className="page-title">
        Messages <span>with Teachers</span>
        <button className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }} onClick={() => setShowForm(v=>!v)}>+ New Message</button>
      </div>

      {showForm && (
        <div className="card" style={{ padding:20, marginBottom:18 }}>
          <form onSubmit={send}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="form-group">
                <label className="form-label">Regarding Child</label>
                <select className="form-input" value={compose.studentId} onChange={e => {
                  const child = children.find(c=>c._id===e.target.value);
                  setCompose(f=>({ ...f, studentId:e.target.value, recipientId: child?.classTeacher?._id||'' }));
                }}>
                  {children.map(c => <option key={c._id} value={c._id}>{c.user?.name} – Grade {c.grade}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Subject</label>
                <input className="form-input" value={compose.subject} onChange={e=>setCompose(f=>({...f,subject:e.target.value}))} placeholder="e.g. Regarding attendance" />
              </div>
              <div className="form-group" style={{ gridColumn:'1/-1' }}>
                <label className="form-label">Message *</label>
                <textarea className="form-input" rows={3} style={{ resize:'vertical' }} value={compose.body} onChange={e=>setCompose(f=>({...f,body:e.target.value}))} required placeholder="Type your message to the class teacher…" />
              </div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <button type="submit" className="btn btn-primary btn-sm" disabled={sending}>{sending?'Sending…':'Send'}</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={()=>setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span className="card-title">All Messages</span>
        </div>
        {messages.length===0 ? <div className="empty-state">No messages yet. Start a conversation with the class teacher.</div> : (
          messages.map(m => {
            const isSent = m.sender?._id === user._id || m.sender === user._id;
            return (
              <div key={m._id} style={{ padding:'14px 18px', borderBottom:'1px solid #2C2C2C' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <div style={{ width:28, height:28, borderRadius:7, background: isSent ? '#1A1A1A' : 'rgba(223,116,12,0.12)', border:`1px solid ${isSent?'#2C2C2C':'rgba(223,116,12,0.25)'}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:9, fontWeight:700, color: isSent ? '#606060' : '#DF740C', flexShrink:0 }}>
                    {(isSent ? m.recipient?.name : m.sender?.name)?.slice(0,2).toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>
                      {isSent ? `To: ${m.recipient?.name}` : `From: ${m.sender?.name}`}
                      {!m.read && !isSent && <span className="badge badge-orange" style={{ marginLeft:8 }}>New</span>}
                    </div>
                    <div style={{ fontSize:10, color:'#606060' }}>{new Date(m.createdAt).toLocaleString()}</div>
                  </div>
                  {m.student && <span className="badge badge-muted">Re: {m.student.admissionNo}</span>}
                </div>
                {m.subject && <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:4 }}>{m.subject}</div>}
                <div style={{ fontSize:12.5, color:'#A0A0A0', marginBottom: !isSent ? 10 : 0, lineHeight:1.5 }}>{m.body}</div>
                {!isSent && (
                  <div style={{ display:'flex', gap:8, marginTop:8 }}>
                    <input className="form-input" style={{ flex:1, padding:'7px 12px', fontSize:12.5 }}
                      placeholder="Reply to teacher…" value={reply[m._id]||''}
                      onChange={e=>setReply(r=>({...r,[m._id]:e.target.value}))}
                      onKeyDown={e=>e.key==='Enter'&&sendReply(m)} />
                    <button className="btn btn-primary btn-sm" onClick={()=>sendReply(m)}>Send</button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
