import { useAuth } from '../context/AuthContext';

export default function ContactMentor() {
  const { profile } = useAuth();
  const teacher = profile?.classTeacher;

  return (
    <div className="page fade-up">
      <div className="page-title">Contact <span>Class Teacher</span></div>
      {!teacher ? (
        <div className="card"><div className="empty-state">No class teacher assigned yet. Contact admin.</div></div>
      ) : (
        <div className="card" style={{ maxWidth:480, padding:28 }}>
          <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:24 }}>
            <div style={{ width:56, height:56, borderRadius:14, background:'linear-gradient(135deg,#DF740C,#7A3800)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800, color:'#000' }}>
              {teacher.name?.slice(0,2).toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'#fff' }}>{teacher.name}</div>
              <div style={{ fontSize:12, color:'#DF740C', fontWeight:600, marginTop:2 }}>Class Teacher</div>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom:'1px solid #2C2C2C' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#DF740C" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
            <div>
              <div style={{ fontSize:10, color:'#606060', fontWeight:700, textTransform:'uppercase', letterSpacing:0.5 }}>Email</div>
              <div style={{ fontSize:13, color:'#fff', marginTop:1 }}>{teacher.email}</div>
            </div>
          </div>

          <div style={{ marginTop:16, padding:14, background:'#222', borderRadius:8, border:'1px solid #2C2C2C' }}>
            <div style={{ fontSize:11, fontWeight:700, color:'#606060', textTransform:'uppercase', letterSpacing:0.5, marginBottom:6 }}>Office Hours</div>
            <div style={{ fontSize:13, color:'#A0A0A0' }}>Monday – Friday, 8:00 AM – 9:00 AM</div>
            <div style={{ fontSize:12, color:'#606060', marginTop:4 }}>Available in the Staff Room during breaks</div>
          </div>

          <a href={`mailto:${teacher.email}`} className="btn btn-primary" style={{ marginTop:20, width:'100%', justifyContent:'center' }}>
            Send Email
          </a>
        </div>
      )}
    </div>
  );
}
