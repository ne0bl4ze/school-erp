import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

function StatCard({ value, label, color }) {
  const c = { orange:'#DF740C', green:'#22C55E', red:'#EF4444', blue:'#3B82F6', teal:'#14B8A6' }[color];
  return (
    <div style={{ background:'#181818', border:'1px solid #2C2C2C', borderRadius:10, padding:'18px 14px 14px', textAlign:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:c }} />
      <div style={{ fontSize:26, fontWeight:800, color:'#fff', marginBottom:6 }}>{value}</div>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.9px', textTransform:'uppercase', color:c }}>{label}</div>
    </div>
  );
}

export default function TeacherDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(null);

  useEffect(() => {
    api.get('/dashboard/teacher').then(r => setData(r.data)).finally(() => setLoading(false));
    // Get timetable to show today's periods
    api.get('/timetable/my').catch(() => {});
  }, []);

  const today = DAYS[new Date().getDay()];

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  return (
    <div className="page fade-up">
      <div className="page-title">Teacher <span>Dashboard</span></div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:20 }}>
        <StatCard value={data?.courses?.length ?? 0}   label="My Subjects"   color="orange" />
        <StatCard value={data?.attendanceToday ?? 0}   label="Records Today" color="green"  />
        <StatCard value={data?.pendingLeaves ?? 0}     label="Leave Pending" color="red"    />
        <StatCard value={data?.unreadMessages ?? 0}    label="New Messages"  color="blue"   />
        <StatCard value={today}                         label="Today"         color="teal"   />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
        {/* My Subjects */}
        <div className="card">
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            <span className="card-title">My Subjects</span>
            <div className="card-actions"><Link to="/my-classes" style={{ fontSize:11.5, fontWeight:500, color:'#DF740C' }}>Manage →</Link></div>
          </div>
          {!data?.courses?.length ? <div className="empty-state">No subjects assigned</div> : (
            <table>
              <thead><tr><th>Subject</th><th>Code</th><th>Grade</th></tr></thead>
              <tbody>
                {data.courses.map(c => (
                  <tr key={c._id}>
                    <td style={{ color:'#fff', fontWeight:500 }}>{c.name}</td>
                    <td style={{ fontFamily:'monospace', fontSize:11 }}>{c.code}</td>
                    <td>Grade {c.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pending Leave Requests */}
        <div className="card">
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span className="card-title">Leave Requests</span>
            <div className="card-actions"><Link to="/leave" style={{ fontSize:11.5, fontWeight:500, color:'#DF740C' }}>View All →</Link></div>
          </div>
          {!data?.pendingLeaveList?.length ? <div className="empty-state">No pending requests</div> : (
            <table>
              <thead><tr><th>Student</th><th>Type</th><th>From</th></tr></thead>
              <tbody>
                {data.pendingLeaveList.map(l => (
                  <tr key={l._id}>
                    <td style={{ color:'#fff', fontWeight:500 }}>{l.student?.user?.name}</td>
                    <td><span className="badge badge-muted">{l.type}</span></td>
                    <td style={{ fontSize:11 }}>{new Date(l.from).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Messages */}
      <div className="card" style={{ marginTop:18 }}>
        <div className="card-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span className="card-title">Recent Parent Messages</span>
          <div className="card-actions"><Link to="/messages" style={{ fontSize:11.5, fontWeight:500, color:'#DF740C' }}>Inbox →</Link></div>
        </div>
        {!data?.recentMessages?.length ? <div className="empty-state">No messages yet</div> : (
          data.recentMessages.map(m => (
            <div key={m._id} style={{ padding:'12px 18px', borderBottom:'1px solid #2C2C2C', display:'flex', gap:12, alignItems:'flex-start' }}>
              <div style={{ width:30, height:30, borderRadius:8, background:'rgba(223,116,12,0.12)', border:'1px solid rgba(223,116,12,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:700, color:'#DF740C', flexShrink:0 }}>
                {m.sender?.name?.slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:600, color:'#fff' }}>{m.sender?.name}
                  {!m.read && <span className="badge badge-orange" style={{ marginLeft:8 }}>New</span>}
                </div>
                <div style={{ fontSize:12, color:'#606060', marginTop:2 }}>{m.subject || m.body?.slice(0,60)}</div>
              </div>
              <div style={{ fontSize:10, color:'#606060', flexShrink:0 }}>{new Date(m.createdAt).toLocaleDateString()}</div>
            </div>
          ))
        )}
      </div>

      {/* Quick actions */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginTop:18 }}>
        {[
          { label:'Mark Attendance', to:'/attendance', icon:'✅' },
          { label:'Enter Grades',    to:'/grades',     icon:'📝' },
          { label:'View Students',   to:'/school-students', icon:'👥' },
        ].map(q => (
          <Link key={q.to} to={q.to} style={{ textDecoration:'none' }}>
            <div className="card" style={{ padding:16, textAlign:'center', cursor:'pointer', transition:'border-color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='#DF740C'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='#2C2C2C'}
            >
              <div style={{ fontSize:26, marginBottom:6 }}>{q.icon}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{q.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
