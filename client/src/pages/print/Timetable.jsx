import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Slab:wght@700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #e5e7eb; font-family: 'Roboto', sans-serif; color: #111827; }

  .print-wrapper {
    width: 297mm;
    background: #fff;
    margin: 24px auto;
    padding: 0;
    box-shadow: 0 4px 24px rgba(0,0,0,.18);
  }

  .doc-header {
    background: #000;
    color: #fff;
    padding: 16px 28px 12px;
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .school-emblem {
    width: 52px; height: 52px;
    border-radius: 50%;
    background: #DF740C;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Roboto Slab', serif;
    font-size: 18px; font-weight: 700; color: #000;
    flex-shrink: 0;
  }
  .school-name { font-family: 'Roboto Slab', serif; font-size: 17px; font-weight: 700; color: #DF740C; }
  .school-sub { font-size: 9px; color: #9ca3af; margin-top: 2px; }
  .doc-badge {
    margin-left: auto;
    background: #DF740C; color: #000;
    padding: 5px 14px; border-radius: 4px;
    font-weight: 700; font-size: 10px; letter-spacing: 1px; text-transform: uppercase;
  }

  .orange-rule { height: 3px; background: linear-gradient(90deg, #DF740C 60%, #7a3800); }

  .title-bar {
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
    padding: 10px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .title-text { font-size: 14px; font-weight: 700; color: #111827; }
  .title-meta { font-size: 10px; color: #6b7280; }

  .info-strip {
    display: flex; gap: 0;
    border-bottom: 1px solid #e5e7eb;
  }
  .info-item {
    flex: 1;
    padding: 8px 16px;
    border-right: 1px solid #e5e7eb;
    font-size: 11px;
  }
  .info-item:last-child { border-right: none; }
  .info-key { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 2px; }
  .info-val { font-weight: 600; color: #111827; }

  /* Timetable grid */
  .tt-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    border-left: 1px solid #e5e7eb;
  }
  .day-col { border-right: 1px solid #e5e7eb; }
  .day-header {
    background: #111827;
    color: #fff;
    padding: 10px 14px;
    font-size: 11px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
    text-align: center;
    border-bottom: 1px solid #e5e7eb;
  }
  .slot {
    padding: 10px 14px;
    border-bottom: 1px solid #f3f4f6;
  }
  .slot:last-child { border-bottom: none; }
  .slot-time { font-size: 9px; font-weight: 700; color: #DF740C; margin-bottom: 3px; }
  .slot-name { font-size: 11px; font-weight: 600; color: #111827; line-height: 1.3; }
  .slot-room { font-size: 9px; color: #6b7280; margin-top: 2px; }
  .slot-lab  { font-size: 8px; color: #3B82F6; font-weight: 700; margin-top: 2px; }
  .slot-free { padding: 16px 14px; text-align: center; font-size: 11px; color: #d1d5db; }

  /* Footer */
  .doc-footer {
    border-top: 1px solid #e5e7eb;
    padding: 10px 28px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .footer-note { font-size: 8px; color: #9ca3af; line-height: 1.6; }
  .school-stamp {
    width: 56px; height: 56px;
    border: 1.5px dashed #d1d5db;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 7px; color: #d1d5db; text-align: center;
    text-transform: uppercase;
  }

  .no-print {
    position: fixed; bottom: 24px; right: 24px;
    display: flex; gap: 10px; z-index: 999;
  }
  .btn-print {
    background: #DF740C; color: #000;
    border: none; border-radius: 8px;
    padding: 12px 24px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 12px rgba(223,116,12,.4);
  }
  .btn-print:hover { opacity: .85; }
  .btn-close {
    background: #111827; color: #fff;
    border: none; border-radius: 8px;
    padding: 12px 18px;
    font-size: 14px; font-weight: 700; cursor: pointer;
  }

  @media print {
    body { background: #fff; }
    .no-print { display: none !important; }
    .print-wrapper { margin: 0; box-shadow: none; width: 100%; }
    @page { size: A4 landscape; margin: 0; }
  }
`;

export default function PrintTimetable() {
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  const { profile } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const ttReq = childId
      ? api.get(`/parents/child/${childId}/timetable`)
      : api.get('/timetable/my');
    const studentReq = childId
      ? api.get(`/students/${childId}`).catch(() => ({ data: null }))
      : api.get('/students/me').catch(() => ({ data: null }));

    Promise.all([ttReq, studentReq])
      .then(([ttRes, stuRes]) => {
        if (!ttRes.data) { setError('No timetable found for this class.'); return; }
        setData({ timetable: ttRes.data, student: stuRes.data });
      })
      .catch(e => setError(e.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false));
  }, [childId]);

  // Also get child info from profile if available
  const childFromProfile = childId && profile?.children
    ? profile.children.find(c => c._id === childId)
    : null;

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'Roboto,sans-serif', color:'#6b7280' }}>
      Loading timetable…
    </div>
  );
  if (error) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'Roboto,sans-serif', color:'#ef4444' }}>
      {error}
    </div>
  );

  const { timetable, student } = data;
  const stu = student || childFromProfile;
  const byDay = {};
  DAYS.forEach(d => { byDay[d] = []; });
  (timetable.slots || []).forEach(s => { if (byDay[s.day]) byDay[s.day].push(s); });
  DAYS.forEach(d => byDay[d].sort((a,b) => a.startTime.localeCompare(b.startTime)));

  const maxSlots = Math.max(...DAYS.map(d => byDay[d].length), 1);
  const today = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });

  return (
    <>
      <style>{style}</style>

      <div className="no-print">
        <button className="btn-close" onClick={() => window.close()}>✕ Close</button>
        <button className="btn-print" onClick={() => window.print()}>🖨 Print Timetable</button>
      </div>

      <div className="print-wrapper">
        {/* Header */}
        <div className="doc-header">
          <div className="school-emblem">ERP</div>
          <div>
            <div className="school-name">Excellence School</div>
            <div className="school-sub">123 School Road, City · Tel: +91-98765-43210</div>
          </div>
          <div className="doc-badge">Class Timetable</div>
        </div>
        <div className="orange-rule" />

        {/* Title bar */}
        <div className="title-bar">
          <div className="title-text">
            Weekly Timetable — Grade {timetable.grade}, Section {timetable.section}
          </div>
          <div className="title-meta">AY {timetable.academicYear} · Issued: {today}</div>
        </div>

        {/* Student info strip */}
        {stu && (
          <div className="info-strip">
            {[
              ['Student',       stu.user?.name || stu.name || '—'],
              ['Admission No',  stu.admissionNo || '—'],
              ['Grade / Sec',   `Grade ${stu.grade} – Section ${stu.section}`],
              ['Class Teacher', stu.classTeacher?.name || childFromProfile?.classTeacher?.name || '—'],
              ['Academic Year', timetable.academicYear],
            ].map(([k, v]) => (
              <div key={k} className="info-item">
                <div className="info-key">{k}</div>
                <div className="info-val">{v}</div>
              </div>
            ))}
          </div>
        )}

        {/* Timetable grid */}
        <div className="tt-grid">
          {DAYS.map(day => (
            <div key={day} className="day-col">
              <div className="day-header">{day}</div>
              {byDay[day].length === 0 ? (
                <div className="slot-free">No periods</div>
              ) : (
                byDay[day].map((slot, i) => (
                  <div key={i} className="slot">
                    <div className="slot-time">{slot.startTime} – {slot.endTime}</div>
                    <div className="slot-name">{slot.course?.name || '—'}</div>
                    <div className="slot-room">{slot.room}</div>
                    {slot.type === 'lab' && <div className="slot-lab">LAB SESSION</div>}
                  </div>
                ))
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="doc-footer">
          <div>
            <div className="footer-note">This timetable is effective for Academic Year {timetable.academicYear}.</div>
            <div className="footer-note">Subject to change — check with class teacher for updates. Printed on {today}.</div>
          </div>
          <div style={{ display:'flex', gap:40 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:100, borderBottom:'1px solid #374151', height:28 }} />
              <div style={{ fontSize:8, color:'#6b7280', fontWeight:700, marginTop:4, textTransform:'uppercase', letterSpacing:'.3px' }}>Class Teacher</div>
            </div>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:100, borderBottom:'1px solid #374151', height:28 }} />
              <div style={{ fontSize:8, color:'#6b7280', fontWeight:700, marginTop:4, textTransform:'uppercase', letterSpacing:'.3px' }}>Principal</div>
            </div>
          </div>
          <div className="school-stamp">School<br/>Seal</div>
        </div>
      </div>
    </>
  );
}
