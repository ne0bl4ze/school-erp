import { useState } from 'react';

const POSTS = [
  { id:1, title:'How to Score Full Marks in Mathematics', author:'Head of Math Dept.', date:'May 5, 2026', tags:['study','math'], body:'Practice is the only shortcut. Solve at least 10 problems daily, focus on understanding steps rather than memorising answers, and always show your working.' },
  { id:2, title:'Annual Sports Day — Highlights', author:'Sports Committee', date:'Apr 28, 2026', tags:['sports','events'], body:"This year's Sports Day was a grand success with 400 participants. Congratulations to Grade 10-A for winning the overall trophy for the third year running!" },
  { id:3, title:'Science Exhibition 2026 — Call for Entries', author:'Science Department', date:'Apr 20, 2026', tags:['science','activity'], body:'All students from Grade 6 to 12 are invited to submit project proposals for the Annual Science Exhibition. Last date for submission is May 20, 2026.' },
  { id:4, title:'Library Book Fair — This Week', author:'School Library', date:'Apr 15, 2026', tags:['library','reading'], body:'Visit the school library book fair this week and pick your favourite books at discounted prices. Open from 9 AM to 4 PM, Monday to Friday.' },
];

export default function Blogs() {
  const [open, setOpen] = useState(null);

  return (
    <div className="page fade-up">
      <div className="page-title">School <span>Blog</span></div>
      <div style={{ display:'grid', gap:12 }}>
        {POSTS.map(b => (
          <div key={b.id} className="card" style={{ overflow:'hidden' }}>
            <div
              style={{ padding:'16px 20px', cursor:'pointer', background: open===b.id ? '#1E1E1E' : 'transparent' }}
              onClick={() => setOpen(o => o===b.id ? null : b.id)}
            >
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                {b.tags.map(t => <span key={t} className="badge badge-muted">{t}</span>)}
                <span style={{ fontSize:10.5, color:'#606060', marginLeft:'auto' }}>{b.date}</span>
              </div>
              <div style={{ fontSize:15, fontWeight:700, color:'#fff', marginBottom:4 }}>{b.title}</div>
              <div style={{ fontSize:12, color:'#606060' }}>By {b.author}</div>
            </div>
            {open === b.id && (
              <div style={{ padding:'0 20px 20px', borderTop:'1px solid #2C2C2C' }}>
                <p style={{ fontSize:13, color:'#A0A0A0', lineHeight:1.7, marginTop:14 }}>{b.body}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
