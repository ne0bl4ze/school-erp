import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

const STATUS_BADGE = { pending:'orange', approved:'green', rejected:'red', enrolled:'teal' };

export default function AdmissionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adm,    setAdm]    = useState(null);
  const [loading,setLoading]= useState(true);
  const [enrollForm, setEnrollForm] = useState({ section:'A', admissionNo:'' });
  const [enrolling, setEnrolling]   = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get(`/admissions/${id}`).then(r => setAdm(r.data)).finally(() => setLoading(false));
  }, [id]);

  const changeStatus = async (status) => {
    await api.put(`/admissions/${id}/status`, { status });
    setAdm(a => ({ ...a, status }));
  };

  const enroll = async () => {
    setEnrolling(true); setMsg('');
    try {
      const r = await api.post(`/admissions/${id}/enroll`, enrollForm);
      setMsg(`✓ Enrolled! Student email: ${r.data.studentEmail} | Parent email: ${r.data.parentEmail}`);
      setAdm(a => ({ ...a, status:'enrolled' }));
    } catch (err) {
      setMsg('Error: ' + (err.response?.data?.message || 'Failed'));
    } finally { setEnrolling(false); }
  };

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;
  if (!adm) return <div className="page"><div className="empty-state">Not found</div></div>;

  const fields = [
    ['Application No', adm.applicationNo],['Status', null],['Applied For', `Grade ${adm.grade} – ${adm.stream}`],
    ['Academic Year', adm.academicYear],['Date of Birth', adm.dob ? new Date(adm.dob).toLocaleDateString() : '—'],
    ['Gender', adm.gender],['Previous School', adm.previousSchool || '—'],['Address', adm.address || '—'],
    ['Parent Name', adm.parentName],['Parent Email', adm.parentEmail],['Parent Phone', adm.parentPhone || '—'],
  ];

  return (
    <div className="page fade-up">
      <div className="page-title">
        <button className="btn btn-ghost btn-sm" onClick={() => navigate('/admissions')} style={{ marginRight:8 }}>← Back</button>
        Application — <span>{adm.applicantName}</span>
      </div>

      {msg && (
        <div style={{ background: msg.startsWith('✓') ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border:`1px solid ${msg.startsWith('✓')?'rgba(34,197,94,0.3)':'rgba(239,68,68,0.3)'}`, borderRadius:8, padding:'12px 16px', marginBottom:16, fontSize:13, color: msg.startsWith('✓') ? '#22C55E' : '#EF4444' }}>
          {msg}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:18, alignItems:'start' }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Applicant Details</span>
          </div>
          {fields.map(([label, val]) => (
            <div key={label} style={{ display:'flex', padding:'10px 18px', borderBottom:'1px solid #2C2C2C' }}>
              <div style={{ width:160, fontSize:11, fontWeight:700, color:'#606060', textTransform:'uppercase', letterSpacing:0.5, flexShrink:0 }}>{label}</div>
              {label === 'Status'
                ? <span className={`badge badge-${STATUS_BADGE[adm.status]}`}>{adm.status}</span>
                : <div style={{ fontSize:13, color:'#fff', fontWeight:500 }}>{val}</div>
              }
            </div>
          ))}
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {/* Actions */}
          {adm.status === 'pending' && (
            <div className="card" style={{ padding:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#606060', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Quick Actions</div>
              <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                <button className="btn btn-ghost" style={{ color:'#22C55E', borderColor:'#22C55E', justifyContent:'center' }} onClick={() => changeStatus('approved')}>✓ Approve Application</button>
                <button className="btn btn-ghost" style={{ color:'#EF4444', borderColor:'#EF4444', justifyContent:'center' }} onClick={() => changeStatus('rejected')}>✗ Reject Application</button>
              </div>
            </div>
          )}

          {/* Enroll section */}
          {adm.status === 'approved' && (
            <div className="card" style={{ padding:18 }}>
              <div style={{ fontSize:11, fontWeight:700, color:'#DF740C', textTransform:'uppercase', letterSpacing:1, marginBottom:12 }}>Enroll Student</div>
              <div className="form-group">
                <label className="form-label">Admission Number</label>
                <input className="form-input" placeholder="e.g. SCH2025010" value={enrollForm.admissionNo} onChange={e => setEnrollForm(f=>({...f,admissionNo:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Section</label>
                <select className="form-input" value={enrollForm.section} onChange={e => setEnrollForm(f=>({...f,section:e.target.value}))}>
                  {['A','B','C','D'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button className="btn btn-primary" style={{ width:'100%', justifyContent:'center' }} onClick={enroll} disabled={enrolling}>
                {enrolling ? 'Enrolling…' : '🎓 Enroll & Create Accounts'}
              </button>
            </div>
          )}

          {adm.status === 'enrolled' && (
            <div className="card" style={{ padding:18, borderColor:'rgba(34,197,94,0.4)' }}>
              <div style={{ fontSize:13, fontWeight:600, color:'#22C55E', marginBottom:8 }}>✓ Student Enrolled</div>
              <p style={{ fontSize:12, color:'#606060', lineHeight:1.6 }}>Student and parent accounts have been created. They can login with their email addresses.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
