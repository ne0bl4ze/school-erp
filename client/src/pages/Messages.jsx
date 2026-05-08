import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [reply,    setReply]    = useState({});
  const [sending,  setSending]  = useState(false);

  const load = () => api.get('/messages').then(r => setMessages(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const sendReply = async (msg) => {
    if (!reply[msg._id]?.trim()) return;
    setSending(true);
    const recipientId = msg.sender._id === user._id ? msg.recipient._id : msg.sender._id;
    await api.post('/messages', { recipientId, studentId: msg.student?._id, subject: `Re: ${msg.subject || ''}`, body: reply[msg._id], replyTo: msg._id });
    setReply(r => ({ ...r, [msg._id]:'' }));
    setSending(false); load();
  };

  const markRead = async (id) => {
    await api.put(`/messages/${id}/read`);
    load();
  };

  const inbox  = messages.filter(m => m.recipient?._id === user._id || m.recipient === user._id);
  const sent   = messages.filter(m => m.sender?._id   === user._id || m.sender   === user._id);

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  return (
    <div className="page fade-up">
      <div className="page-title">Messages <span>Inbox</span></div>

      <div className="card">
        <div className="card-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span className="card-title">Inbox ({inbox.filter(m=>!m.read).length} unread)</span>
        </div>
        {inbox.length === 0 ? <div className="empty-state">No messages received yet</div> : (
          inbox.map(m => (
            <div key={m._id} style={{ padding:'14px 18px', borderBottom:'1px solid #2C2C2C', background: !m.read ? 'rgba(223,116,12,0.03)' : 'transparent' }}
              onClick={() => !m.read && markRead(m._id)}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                <div style={{ width:30, height:30, borderRadius:8, background:'rgba(223,116,12,0.12)', border:'1px solid rgba(223,116,12,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#DF740C', flexShrink:0 }}>
                  {m.sender?.name?.slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>
                    {m.sender?.name}
                    {!m.read && <span className="badge badge-orange" style={{ marginLeft:8 }}>New</span>}
                  </div>
                  <div style={{ fontSize:10.5, color:'#606060' }}>{new Date(m.createdAt).toLocaleString()}</div>
                </div>
                {m.student && <span className="badge badge-muted">Re: {m.student.admissionNo}</span>}
              </div>
              {m.subject && <div style={{ fontSize:13, fontWeight:600, color:'#fff', marginBottom:4 }}>{m.subject}</div>}
              <div style={{ fontSize:12.5, color:'#A0A0A0', marginBottom:12, lineHeight:1.5 }}>{m.body}</div>
              <div style={{ display:'flex', gap:8 }}>
                <input className="form-input" style={{ flex:1, padding:'7px 12px', fontSize:12.5 }}
                  placeholder="Reply…" value={reply[m._id]||''}
                  onChange={e => setReply(r => ({ ...r, [m._id]:e.target.value }))}
                  onKeyDown={e => e.key==='Enter' && sendReply(m)} />
                <button className="btn btn-primary btn-sm" onClick={() => sendReply(m)} disabled={sending}>Send</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="card" style={{ marginTop:18 }}>
        <div className="card-header"><span className="card-title">Sent ({sent.length})</span></div>
        {sent.length === 0 ? <div className="empty-state">No messages sent</div> : (
          sent.map(m => (
            <div key={m._id} style={{ padding:'12px 18px', borderBottom:'1px solid #2C2C2C' }}>
              <div style={{ fontSize:12, color:'#A0A0A0' }}>
                To: <span style={{ color:'#fff', fontWeight:500 }}>{m.recipient?.name}</span>
                <span style={{ color:'#606060', marginLeft:12 }}>{new Date(m.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ fontSize:12.5, color:'#A0A0A0', marginTop:4 }}>{m.body}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
