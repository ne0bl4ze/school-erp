import { useAuth } from '../context/AuthContext';

export default function Hostel() {
  const { profile } = useAuth();

  const details = [
    { label:'Room Number',    value: profile?.hostelRoom || 'Not Assigned' },
    { label:'Block',          value: profile?.hostelRoom ? `Block ${profile.hostelRoom[0]}` : '—' },
    { label:'Warden',         value: 'Mr. D. Sharma' },
    { label:'Warden Contact', value: '+91 98765 43210' },
    { label:'Mess Timings',   value: 'Breakfast 6:30–7:30 AM  |  Lunch 12–1 PM  |  Dinner 7–8 PM' },
    { label:'Study Hours',    value: '7:00 PM – 9:30 PM (Mandatory)' },
    { label:'Lights Out',     value: '10:00 PM' },
    { label:'WiFi',           value: 'School-Hostel (Password at reception)' },
    { label:'Laundry',        value: 'Tuesday & Saturday, Ground Floor' },
    { label:'Medical Room',   value: 'Block D, Ground Floor – 24×7' },
  ];

  return (
    <div className="page fade-up">
      <div className="page-title">Hostel <span>Details</span></div>
      <div className="card">
        <div className="card-header">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="card-title">Room &amp; Facilities</span>
        </div>
        {details.map(d => (
          <div key={d.label} style={{ display:'flex', padding:'12px 18px', borderBottom:'1px solid #2C2C2C', alignItems:'center' }}>
            <div style={{ width:170, fontSize:11, fontWeight:700, color:'#606060', textTransform:'uppercase', letterSpacing:0.5, flexShrink:0 }}>{d.label}</div>
            <div style={{ fontSize:13, color:'#fff', fontWeight:500 }}>{d.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
