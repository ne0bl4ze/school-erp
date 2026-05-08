import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

function StatCard({ value, label, color, sub }) {
  const c = { orange:'#DF740C', green:'#22C55E', red:'#EF4444', blue:'#3B82F6', teal:'#14B8A6' }[color];
  return (
    <div style={{ background:'#181818', border:'1px solid #2C2C2C', borderRadius:10, padding:'18px 14px 14px', textAlign:'center', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:c }} />
      <div style={{ fontSize:28, fontWeight:800, color:'#fff', marginBottom:6 }}>{value}</div>
      <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.9px', textTransform:'uppercase', color:c }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:'#606060', marginTop:4 }}>{sub}</div>}
    </div>
  );
}

const STATUS_COLOR = { pending:'orange', approved:'green', rejected:'red', enrolled:'teal' };

export default function PrincipalDashboard() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/principal').then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  const quickAction = async (id, status) => {
    await api.put(`/admissions/${id}/status`, { status });
    api.get('/dashboard/principal').then(r => setData(r.data));
  };

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  return (
    <div className="page fade-up">
      <div className="page-title">Principal's <span>Dashboard</span></div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:20 }}>
        <StatCard value={data?.students ?? 0}          label="Total Students"       color="blue"   />
        <StatCard value={data?.teachers ?? 0}          label="Teachers"             color="green"  />
        <StatCard value={data?.pendingAdmissions ?? 0} label="Pending Admissions"   color="orange" />
        <StatCard value={data?.unpaidFees ?? 0}        label="Unpaid Fees"          color="red"    />
        <StatCard value={data?.gradeBreakdown?.length ?? 0} label="Active Grades"  color="teal"   />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:18 }}>
        {/* Pending Admissions */}
        <div className="card">
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span className="card-title">Pending Admissions</span>
            <div className="card-actions">
              <Link to="/admissions/new" className="btn btn-primary btn-sm">+ New</Link>
              <Link to="/admissions" style={{ fontSize:11.5, fontWeight:500, color:'#DF740C', marginLeft:8 }}>View All →</Link>
            </div>
          </div>
          {!data?.recentAdmissions?.length ? (
            <div className="empty-state">No pending admissions</div>
          ) : (
            <table>
              <thead><tr><th>Applicant</th><th>Grade</th><th>Applied</th><th>Actions</th></tr></thead>
              <tbody>
                {data.recentAdmissions.map(adm => (
                  <tr key={adm._id}>
                    <td style={{ color:'#fff', fontWeight:500 }}>{adm.applicantName}</td>
                    <td>Grade {adm.grade}</td>
                    <td style={{ fontSize:11 }}>{new Date(adm.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize:11, padding:'3px 8px', color:'#22C55E', borderColor:'#22C55E' }}
                          onClick={() => quickAction(adm._id, 'approved')}>Approve</button>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize:11, padding:'3px 8px', color:'#EF4444', borderColor:'#EF4444' }}
                          onClick={() => quickAction(adm._id, 'rejected')}>Reject</button>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize:11, padding:'3px 8px' }}
                          onClick={() => navigate(`/admissions/${adm._id}`)}>View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Grade breakdown */}
        <div className="card">
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            <span className="card-title">Students by Grade</span>
          </div>
          {!data?.gradeBreakdown?.length ? (
            <div className="empty-state">No data</div>
          ) : (
            <div style={{ padding:'8px 0' }}>
              {data.gradeBreakdown.map(g => {
                const pct = data.students ? Math.round((g.count / data.students) * 100) : 0;
                return (
                  <div key={g._id} style={{ padding:'8px 18px', borderBottom:'1px solid #2C2C2C' }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:'#fff' }}>Grade {g._id}</span>
                      <span style={{ fontSize:12, color:'#DF740C', fontWeight:700 }}>{g.count} students</span>
                    </div>
                    <div style={{ height:4, background:'#2C2C2C', borderRadius:2 }}>
                      <div style={{ height:'100%', width:`${pct}%`, background:'#DF740C', borderRadius:2 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginTop:18 }}>
        {[
          { label:'Manage Admissions', to:'/admissions',    icon:'📋' },
          { label:'Academic Years',    to:'/academic-years', icon:'📅' },
          { label:'Class Promotions',  to:'/promotions',     icon:'🎓' },
          { label:'All Students',      to:'/school-students',icon:'👥' },
        ].map(q => (
          <Link key={q.to} to={q.to} style={{ textDecoration:'none' }}>
            <div className="card" style={{ padding:'18px', textAlign:'center', cursor:'pointer', transition:'border-color 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.borderColor='#DF740C'}
              onMouseLeave={e=>e.currentTarget.style.borderColor='#2C2C2C'}
            >
              <div style={{ fontSize:28, marginBottom:8 }}>{q.icon}</div>
              <div style={{ fontSize:12, fontWeight:600, color:'#fff' }}>{q.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
