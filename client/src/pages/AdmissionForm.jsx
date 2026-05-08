import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function AdmissionForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    applicantName:'', dob:'', gender:'male', grade:'', stream:'General', academicYear:'2025-26',
    parentName:'', parentEmail:'', parentPhone:'', address:'', previousSchool:'',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault(); setSaving(true); setError('');
    try {
      const adm = await api.post('/admissions', form);
      navigate(`/admissions/${adm.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit');
    } finally { setSaving(false); }
  };

  const F = ({ label, name, type='text', opts }) => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {opts ? (
        <select className="form-input" value={form[name]} onChange={e=>set(name,e.target.value)}>
          {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
        </select>
      ) : (
        <input className="form-input" type={type} value={form[name]} onChange={e=>set(name,e.target.value)} />
      )}
    </div>
  );

  return (
    <div className="page fade-up">
      <div className="page-title">New <span>Admission Application</span></div>
      {error && <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', borderRadius:8, padding:'10px 14px', marginBottom:16, fontSize:13, color:'#EF4444' }}>{error}</div>}

      <form onSubmit={submit}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:18 }}>
          <div className="card" style={{ padding:20 }}>
            <div className="card-header" style={{ padding:'0 0 12px', borderBottom:'1px solid #2C2C2C', marginBottom:16 }}>
              <span className="card-title">Student Details</span>
            </div>
            <F label="Full Name *"       name="applicantName" />
            <F label="Date of Birth"     name="dob"    type="date" />
            <F label="Gender"            name="gender" opts={[{v:'male',l:'Male'},{v:'female',l:'Female'},{v:'other',l:'Other'}]} />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <F label="Applying for Grade *" name="grade"   type="number" />
              <F label="Stream"               name="stream"  opts={[{v:'General',l:'General'},{v:'Science',l:'Science'},{v:'Commerce',l:'Commerce'},{v:'Arts',l:'Arts'}]} />
            </div>
            <F label="Academic Year" name="academicYear" opts={[{v:'2025-26',l:'2025-26'},{v:'2026-27',l:'2026-27'}]} />
            <F label="Previous School"   name="previousSchool" />
            <F label="Address"           name="address" />
          </div>

          <div className="card" style={{ padding:20 }}>
            <div className="card-header" style={{ padding:'0 0 12px', borderBottom:'1px solid #2C2C2C', marginBottom:16 }}>
              <span className="card-title">Parent / Guardian Details</span>
            </div>
            <F label="Parent/Guardian Name *" name="parentName" />
            <F label="Parent Email *"          name="parentEmail" type="email" />
            <F label="Parent Phone"            name="parentPhone" type="tel" />
          </div>
        </div>

        <div style={{ display:'flex', gap:10, marginTop:18 }}>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving…':'Submit Application'}</button>
          <button type="button" className="btn btn-ghost" onClick={() => navigate('/admissions')}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
