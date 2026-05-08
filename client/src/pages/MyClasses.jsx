import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function MyClasses() {
  const { profile } = useAuth();
  const courses = profile?.courses || [];

  return (
    <div className="page fade-up">
      <div className="page-title">My <span>Classes</span></div>
      {courses.length === 0 ? (
        <div className="card"><div className="empty-state">No subjects assigned yet. Contact the principal.</div></div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
          {courses.map(c => (
            <div key={c._id} className="card" style={{ padding:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:'rgba(223,116,12,0.12)', border:'1px solid rgba(223,116,12,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:800, color:'#DF740C' }}>
                  {c.code?.slice(3,6) || c.code?.slice(0,3)}
                </div>
                <div>
                  <div style={{ fontSize:14, fontWeight:700, color:'#fff' }}>{c.name}</div>
                  <div style={{ fontSize:11, color:'#606060', marginTop:2 }}>{c.code} · Grade {c.grade}</div>
                </div>
              </div>
              <div style={{ display:'flex', gap:8 }}>
                <a href="/attendance" className="btn btn-ghost btn-sm" style={{ flex:1, justifyContent:'center', fontSize:11 }}>Mark Attendance</a>
                <a href="/grades"     className="btn btn-ghost btn-sm" style={{ flex:1, justifyContent:'center', fontSize:11 }}>Enter Grades</a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
