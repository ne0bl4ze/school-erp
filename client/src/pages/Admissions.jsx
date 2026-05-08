import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

const STATUS_BADGE = { pending:'orange', approved:'green', rejected:'red', enrolled:'teal' };

export default function Admissions() {
  const [list,    setList]    = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all');
  const navigate = useNavigate();

  const load = () => {
    const q = filter !== 'all' ? `?status=${filter}` : '';
    api.get(`/admissions${q}`).then(r => setList(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [filter]);

  const quickStatus = async (id, status) => {
    await api.put(`/admissions/${id}/status`, { status });
    load();
  };

  return (
    <div className="page fade-up">
      <div className="page-title">
        Admissions <span>Management</span>
        <Link to="/admissions/new" className="btn btn-primary btn-sm" style={{ marginLeft:'auto' }}>+ New Application</Link>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {['all','pending','approved','rejected','enrolled'].map(s => (
          <button key={s} className={`btn btn-sm ${filter===s?'btn-primary':'btn-ghost'}`} onClick={() => setFilter(s)}>
            {s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
      </div>

      <div className="card">
        <table>
          <thead><tr><th>App No</th><th>Applicant</th><th>Grade</th><th>Parent</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {list.map(adm => (
              <tr key={adm._id}>
                <td style={{ fontFamily:'monospace', fontSize:11 }}>{adm.applicationNo}</td>
                <td style={{ color:'#fff', fontWeight:500 }}>{adm.applicantName}</td>
                <td>Grade {adm.grade}</td>
                <td style={{ fontSize:11 }}>{adm.parentName}<br/><span style={{ color:'#606060' }}>{adm.parentEmail}</span></td>
                <td style={{ fontSize:11 }}>{new Date(adm.createdAt).toLocaleDateString()}</td>
                <td><span className={`badge badge-${STATUS_BADGE[adm.status]}`}>{adm.status}</span></td>
                <td>
                  <div style={{ display:'flex', gap:5 }}>
                    <button className="btn btn-ghost btn-sm" style={{ fontSize:11, padding:'3px 8px' }} onClick={() => navigate(`/admissions/${adm._id}`)}>View</button>
                    {adm.status === 'pending' && <>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize:11, padding:'3px 8px', color:'#22C55E', borderColor:'#22C55E' }} onClick={() => quickStatus(adm._id,'approved')}>✓</button>
                      <button className="btn btn-ghost btn-sm" style={{ fontSize:11, padding:'3px 8px', color:'#EF4444', borderColor:'#EF4444' }} onClick={() => quickStatus(adm._id,'rejected')}>✗</button>
                    </>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && !loading && <div className="empty-state">No applications found</div>}
      </div>
    </div>
  );
}
