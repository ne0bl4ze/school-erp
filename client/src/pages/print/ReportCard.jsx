import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const GRADE_COLOR = { 'A+':'#166534', A:'#166534', 'B+':'#854d0e', B:'#854d0e', C:'#1e40af', D:'#374151', F:'#991b1b' };

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&family=Roboto+Slab:wght@700&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #e5e7eb; font-family: 'Roboto', sans-serif; color: #111827; }

  .print-wrapper {
    width: 210mm;
    min-height: 297mm;
    background: #fff;
    margin: 24px auto;
    padding: 0;
    box-shadow: 0 4px 24px rgba(0,0,0,.18);
    position: relative;
    page-break-after: always;
  }

  /* ---- header band ---- */
  .doc-header {
    background: #000;
    color: #fff;
    padding: 20px 28px 16px;
    display: flex;
    align-items: center;
    gap: 20px;
  }
  .school-emblem {
    width: 64px; height: 64px;
    border-radius: 50%;
    background: #DF740C;
    display: flex; align-items: center; justify-content: center;
    font-family: 'Roboto Slab', serif;
    font-size: 22px; font-weight: 700; color: #000;
    flex-shrink: 0;
    border: 3px solid #DF740C;
  }
  .school-info { flex: 1; }
  .school-name { font-family: 'Roboto Slab', serif; font-size: 20px; font-weight: 700; color: #DF740C; line-height: 1.2; }
  .school-sub { font-size: 11px; color: #9ca3af; letter-spacing: .5px; margin-top: 3px; }
  .doc-badge {
    background: #DF740C; color: #000;
    padding: 6px 16px; border-radius: 4px;
    font-weight: 700; font-size: 11px; letter-spacing: 1px;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  /* ---- orange rule ---- */
  .orange-rule { height: 4px; background: linear-gradient(90deg, #DF740C 60%, #7a3800); }

  /* ---- doc title ---- */
  .doc-title-bar {
    background: #f9fafb; border-bottom: 1px solid #e5e7eb;
    padding: 12px 28px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .doc-title { font-size: 15px; font-weight: 700; color: #111827; letter-spacing: .3px; }
  .doc-meta { font-size: 11px; color: #6b7280; }

  /* ---- student info grid ---- */
  .info-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 0;
    border: 1px solid #e5e7eb;
    margin: 18px 28px 0;
    border-radius: 6px; overflow: hidden;
  }
  .info-row {
    display: flex;
    border-bottom: 1px solid #e5e7eb;
    border-right: 1px solid #e5e7eb;
  }
  .info-row:nth-child(even) { border-right: none; }
  .info-key {
    width: 120px; flex-shrink: 0;
    background: #f3f4f6;
    padding: 7px 12px;
    font-size: 10px; font-weight: 700;
    color: #6b7280; text-transform: uppercase; letter-spacing: .5px;
    border-right: 1px solid #e5e7eb;
  }
  .info-val {
    padding: 7px 12px;
    font-size: 12px; font-weight: 500; color: #111827;
    flex: 1;
  }

  /* ---- grades table ---- */
  .section-title {
    margin: 20px 28px 8px;
    font-size: 11px; font-weight: 700; color: #6b7280;
    text-transform: uppercase; letter-spacing: 1px;
    display: flex; align-items: center; gap: 10px;
  }
  .section-title::after { content: ''; flex: 1; height: 1px; background: #e5e7eb; }

  .grades-table {
    width: calc(100% - 56px);
    margin: 0 28px;
    border-collapse: collapse;
    font-size: 11.5px;
  }
  .grades-table th {
    background: #111827;
    color: #fff;
    padding: 8px 10px;
    text-align: left;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: .5px;
    text-transform: uppercase;
  }
  .grades-table th:first-child { border-radius: 0; }
  .grades-table td {
    padding: 7px 10px;
    border-bottom: 1px solid #f3f4f6;
    color: #374151;
  }
  .grades-table tr:nth-child(even) td { background: #f9fafb; }
  .grades-table tr:last-child td { border-bottom: none; }
  .grade-pill {
    display: inline-block;
    padding: 2px 8px; border-radius: 4px;
    font-size: 10px; font-weight: 700;
    border: 1px solid currentColor;
  }

  /* ---- result summary ---- */
  .result-bar {
    margin: 16px 28px 0;
    background: #f9fafb;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    padding: 12px 20px;
    display: flex; align-items: center; gap: 24px;
  }
  .result-stat { text-align: center; }
  .result-stat .val { font-size: 22px; font-weight: 700; color: #111827; }
  .result-stat .lbl { font-size: 9px; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .5px; margin-top: 2px; }
  .result-status {
    margin-left: auto;
    padding: 8px 24px;
    border-radius: 6px;
    font-size: 15px; font-weight: 700; letter-spacing: 1px;
  }
  .status-pass { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }
  .status-fail { background: #fee2e2; color: #991b1b; border: 1px solid #fecaca; }

  /* ---- signatures ---- */
  .sig-row {
    margin: 28px 28px 0;
    display: flex; justify-content: space-between;
  }
  .sig-block { text-align: center; }
  .sig-line {
    width: 120px;
    border-bottom: 1.5px solid #374151;
    margin: 0 auto 6px;
    height: 32px;
  }
  .sig-label { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: .5px; }

  /* ---- footer ---- */
  .doc-footer {
    margin-top: 24px;
    border-top: 1px solid #e5e7eb;
    padding: 10px 28px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .footer-note { font-size: 9px; color: #9ca3af; }
  .school-stamp {
    width: 70px; height: 70px;
    border: 2px dashed #d1d5db;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 8px; color: #d1d5db; text-align: center; line-height: 1.3;
    text-transform: uppercase; letter-spacing: .3px;
  }

  /* ---- no-print button ---- */
  .no-print {
    position: fixed; bottom: 28px; right: 28px;
    display: flex; gap: 10px;
    z-index: 999;
  }
  .btn-print {
    background: #DF740C; color: #000;
    border: none; border-radius: 8px;
    padding: 12px 28px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 12px rgba(223,116,12,.4);
    transition: opacity .15s;
  }
  .btn-print:hover { opacity: .85; }
  .btn-close {
    background: #111827; color: #fff;
    border: none; border-radius: 8px;
    padding: 12px 20px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,.3);
  }
  .btn-close:hover { background: #374151; }

  @media print {
    body { background: #fff; }
    .no-print { display: none !important; }
    .print-wrapper { margin: 0; box-shadow: none; width: 100%; min-height: auto; }
    @page { size: A4 portrait; margin: 0; }
  }
`;

const GRADE_COLOR_PRINT = { 'A+':'#166534', A:'#166534', 'B+':'#854d0e', B:'#854d0e', C:'#1e40af', D:'#374151', F:'#991b1b' };

export default function PrintReportCard() {
  const { year } = useParams();
  const [searchParams] = useSearchParams();
  const childId = searchParams.get('childId');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const academicYear = decodeURIComponent(year);
    const gradesReq = childId
      ? api.get(`/parents/child/${childId}/grades`)
      : api.get('/grades/my');
    const studentReq = childId
      ? api.get(`/students/${childId}`).catch(() => ({ data: null }))
      : api.get('/students/me').catch(() => ({ data: null }));

    Promise.all([gradesReq, studentReq]).then(([gradesRes, studentRes]) => {
      const allGrades = gradesRes.data.grades || [];
      const grades    = allGrades.filter(g => g.academicYear === academicYear);
      setData({ grades, student: studentRes.data, academicYear });
    }).catch(e => setError(e.response?.data?.message || 'Failed to load')).finally(() => setLoading(false));
  }, [year, childId]);

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'Roboto,sans-serif', color:'#6b7280' }}>
      Loading report card…
    </div>
  );
  if (error) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', fontFamily:'Roboto,sans-serif', color:'#ef4444' }}>
      {error}
    </div>
  );

  const { grades, student, academicYear } = data;
  const avg = grades.length ? Math.round(grades.reduce((a, g) => a + (g.percentage || 0), 0) / grades.length) : 0;
  const failed = grades.filter(g => g.grade === 'F').length;
  const passed = failed === 0 && grades.length > 0;
  const today  = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const receiptNo = `RC-${academicYear.replace('-','')}-${student?.admissionNo || '0000'}`;

  return (
    <>
      <style>{style}</style>

      <div className="no-print">
        <button className="btn-close" onClick={() => window.close()}>✕ Close</button>
        <button className="btn-print" onClick={() => window.print()}>🖨 Print Report Card</button>
      </div>

      <div className="print-wrapper">
        {/* Header */}
        <div className="doc-header">
          <div className="school-emblem">ERP</div>
          <div className="school-info">
            <div className="school-name">Excellence School</div>
            <div className="school-sub">123 School Road, City · Tel: +91-98765-43210 · erp.school.edu</div>
          </div>
          <div className="doc-badge">Report Card</div>
        </div>
        <div className="orange-rule" />

        {/* Doc title bar */}
        <div className="doc-title-bar">
          <div className="doc-title">Academic Progress Report — {academicYear}</div>
          <div className="doc-meta">Doc No: {receiptNo} &nbsp;|&nbsp; Issued: {today}</div>
        </div>

        {/* Student info */}
        <div className="info-grid">
          {[
            ['Student Name',   student?.user?.name  || '—'],
            ['Admission No',   student?.admissionNo || '—'],
            ['Grade / Class',  `Grade ${student?.grade || '—'}`],
            ['Section',        student?.section || '—'],
            ['Academic Year',  academicYear],
            ['Stream',         student?.stream || 'General'],
            ['Class Teacher',  student?.classTeacher?.name || '—'],
            ['Academic Year',  academicYear],
          ].map(([k, v]) => (
            <div key={k+v} className="info-row">
              <div className="info-key">{k}</div>
              <div className="info-val">{v}</div>
            </div>
          ))}
        </div>

        {/* Grades table */}
        <div className="section-title">Academic Performance</div>
        <table className="grades-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Subject</th>
              <th>Code</th>
              <th>Term 1 <span style={{fontSize:9,fontWeight:400,opacity:.7}}>/100</span></th>
              <th>Term 2 <span style={{fontSize:9,fontWeight:400,opacity:.7}}>/100</span></th>
              <th>Final <span style={{fontSize:9,fontWeight:400,opacity:.7}}>/100</span></th>
              <th>Practical <span style={{fontSize:9,fontWeight:400,opacity:.7}}>/50</span></th>
              <th>Avg %</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g, i) => {
              const gc = GRADE_COLOR_PRINT[g.grade] || '#374151';
              return (
                <tr key={g._id}>
                  <td style={{color:'#9ca3af'}}>{i+1}</td>
                  <td style={{fontWeight:600, color:'#111827'}}>{g.course?.name || '—'}</td>
                  <td style={{fontFamily:'monospace', fontSize:11, color:'#6b7280'}}>{g.course?.code || '—'}</td>
                  <td>{g.term1     ?? '—'}</td>
                  <td>{g.term2     ?? '—'}</td>
                  <td>{g.finalExam ?? '—'}</td>
                  <td>{g.practical ?? '—'}</td>
                  <td style={{fontWeight:700, color:'#111827'}}>{g.percentage != null ? `${g.percentage}%` : '—'}</td>
                  <td>
                    <span className="grade-pill" style={{color:gc, borderColor:gc, background:`${gc}18`}}>
                      {g.grade ?? '—'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Result summary */}
        {grades.length > 0 && (
          <div className="result-bar">
            <div className="result-stat">
              <div className="val">{avg}%</div>
              <div className="lbl">Overall Avg</div>
            </div>
            <div style={{width:1, height:40, background:'#e5e7eb'}} />
            <div className="result-stat">
              <div className="val">{grades.length}</div>
              <div className="lbl">Subjects</div>
            </div>
            <div style={{width:1, height:40, background:'#e5e7eb'}} />
            <div className="result-stat">
              <div className="val" style={{color:'#22c55e'}}>{grades.length - failed}</div>
              <div className="lbl">Passed</div>
            </div>
            <div style={{width:1, height:40, background:'#e5e7eb'}} />
            <div className="result-stat">
              <div className="val" style={{color: failed > 0 ? '#ef4444' : '#9ca3af'}}>{failed}</div>
              <div className="lbl">Failed</div>
            </div>
            <div className={`result-status ${passed ? 'status-pass' : 'status-fail'}`}>
              {passed ? '✓ PROMOTED' : '✗ DETAINED'}
            </div>
          </div>
        )}

        {/* Signatures */}
        <div className="section-title" style={{marginTop:28}}>Authorisation</div>
        <div className="sig-row">
          <div className="sig-block">
            <div className="sig-line" />
            <div className="sig-label">Class Teacher</div>
          </div>
          <div className="sig-block">
            <div className="sig-line" />
            <div className="sig-label">Exam Controller</div>
          </div>
          <div className="sig-block">
            <div className="sig-line" />
            <div className="sig-label">Principal</div>
          </div>
          <div className="sig-block">
            <div className="sig-line" />
            <div className="sig-label">Parent / Guardian</div>
          </div>
        </div>

        {/* Footer */}
        <div className="doc-footer">
          <div>
            <div className="footer-note">This is a computer-generated document. No physical signature required.</div>
            <div className="footer-note" style={{marginTop:3}}>Excellence School · Academic Year {academicYear} · Printed on {today}</div>
          </div>
          <div className="school-stamp">School<br/>Stamp</div>
        </div>
      </div>
    </>
  );
}
