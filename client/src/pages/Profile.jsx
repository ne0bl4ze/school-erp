import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, profile } = useAuth();
  const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

  const fields = [
    { label:'Full Name',      value: user?.name },
    { label:'Email',          value: user?.email },
    { label:'Role',           value: user?.role },
    { label:'Admission No',   value: profile?.admissionNo },
    { label:'Grade',          value: profile?.grade ? `Grade ${profile.grade}` : null },
    { label:'Section',        value: profile?.section },
    { label:'Stream',         value: profile?.stream },
    { label:'Academic Year',  value: profile?.academicYear },
    { label:'Date of Birth',  value: profile?.dob ? new Date(profile.dob).toLocaleDateString() : null },
    { label:'Phone',          value: profile?.phone },
    { label:'Hostel Room',    value: profile?.hostelRoom },
    { label:'Class Teacher',  value: profile?.classTeacher?.name },
    { label:'Parent Email',   value: profile?.parentEmail },
    { label:'Address',        value: profile?.address },
  ].filter(f => f.value);

  return (
    <div className="page fade-up">
      <div className="page-title">My <span>Profile</span></div>
      <div style={{ display:'grid', gridTemplateColumns:'280px 1fr', gap:18, alignItems:'start' }}>
        <div className="card" style={{ padding:24, textAlign:'center' }}>
          <div style={{ width:80, height:80, borderRadius:20, background:'linear-gradient(135deg,#DF740C,#7A3800)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, fontWeight:800, color:'#000', margin:'0 auto 16px' }}>
            {initials}
          </div>
          <div style={{ fontSize:16, fontWeight:700, color:'#fff', marginBottom:4 }}>{user?.name}</div>
          <div style={{ fontSize:12, color:'#DF740C', fontWeight:600, textTransform:'capitalize', marginBottom:4 }}>{user?.role}</div>
          {profile?.admissionNo && <div style={{ fontSize:12, color:'#606060', marginBottom:2 }}>{profile.admissionNo}</div>}
          {profile?.grade && (
            <div style={{ marginTop:8, display:'inline-block', padding:'3px 12px', borderRadius:999, background:'rgba(223,116,12,0.12)', fontSize:11, fontWeight:700, color:'#DF740C', letterSpacing:0.5 }}>
              Grade {profile.grade} – Section {profile.section}
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span className="card-title">Student Information</span>
          </div>
          <div style={{ padding:'8px 0' }}>
            {fields.map(f => (
              <div key={f.label} style={{ display:'flex', padding:'10px 18px', borderBottom:'1px solid #2C2C2C', alignItems:'center' }}>
                <div style={{ width:150, fontSize:11, fontWeight:700, color:'#606060', textTransform:'uppercase', letterSpacing:0.5, flexShrink:0 }}>{f.label}</div>
                <div style={{ fontSize:13, color:'#fff', fontWeight:500 }}>{f.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
