import { useEffect, useState } from 'react';
import api from '../services/api';

export default function SchoolStudents() {
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [grade,    setGrade]    = useState('');
  const [section,  setSection]  = useState('');

  const load = () => {
    const q = new URLSearchParams();
    if (grade)   q.set('grade', grade);
    if (section) q.set('section', section);
    api.get(`/students?${q}`).then(r => setStudents(r.data)).finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, [grade, section]);

  return (
    <div className="page fade-up">
      <div className="page-title">Student <span>Directory</span></div>
      <div style={{ display:'flex', gap:10, marginBottom:16 }}>
        <select className="form-input" style={{ width:140 }} value={grade} onChange={e=>{setGrade(e.target.value);}}>
          <option value="">All Grades</option>
          {[1,2,3,4,5,6,7,8,9,10,11,12].map(g=><option key={g} value={g}>Grade {g}</option>)}
        </select>
        <select className="form-input" style={{ width:120 }} value={section} onChange={e=>setSection(e.target.value)}>
          <option value="">All Sections</option>
          {['A','B','C','D'].map(s=><option key={s}>{s}</option>)}
        </select>
      </div>
      <div className="card">
        <table>
          <thead><tr><th>Name</th><th>Admission No</th><th>Grade</th><th>Section</th><th>Stream</th><th>Academic Year</th></tr></thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id}>
                <td style={{ color:'#fff', fontWeight:500 }}>{s.user?.name}</td>
                <td style={{ fontFamily:'monospace', fontSize:11 }}>{s.admissionNo}</td>
                <td>Grade {s.grade}</td>
                <td>{s.section}</td>
                <td>{s.stream}</td>
                <td>{s.academicYear}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {students.length===0&&!loading && <div className="empty-state">No students found</div>}
      </div>
    </div>
  );
}
