import { useEffect, useState } from 'react';
import api from '../services/api';

export default function Library() {
  const [books,   setBooks]   = useState([]);
  const [issued,  setIssued]  = useState([]);
  const [q,       setQ]       = useState('');
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('issued');

  useEffect(() => {
    Promise.all([
      api.get('/library/my').then(r => setIssued(r.data)),
      api.get('/library/books').then(r => setBooks(r.data)),
    ]).finally(() => setLoading(false));
  }, []);

  const search = async () => {
    const r = await api.get(`/library/books?q=${q}`);
    setBooks(r.data);
  };

  if (loading) return <div className="page"><div className="empty-state">Loading…</div></div>;

  const tabStyle = (t) => ({
    padding:'8px 16px', background:'transparent', border:'none',
    borderBottom: tab===t ? '2px solid #DF740C' : '2px solid transparent',
    color: tab===t ? '#DF740C' : '#606060',
    fontSize:12.5, fontWeight:600, cursor:'pointer', transition:'all 0.15s',
  });

  return (
    <div className="page fade-up">
      <div className="page-title">Library <span>Portal</span></div>

      <div style={{ display:'flex', gap:0, borderBottom:'1px solid #2C2C2C', marginBottom:18 }}>
        <button style={tabStyle('issued')} onClick={() => setTab('issued')}>My Issued Books ({issued.length})</button>
        <button style={tabStyle('catalog')} onClick={() => setTab('catalog')}>Book Catalog</button>
      </div>

      {tab === 'issued' && (
        <div className="card">
          <table>
            <thead><tr><th>Title</th><th>Author</th><th>Issued</th><th>Due Date</th><th>Status</th><th>Fine</th></tr></thead>
            <tbody>
              {issued.map(i => (
                <tr key={i._id}>
                  <td style={{ color:'#fff', fontWeight:500 }}>{i.book?.title}</td>
                  <td>{i.book?.author}</td>
                  <td>{new Date(i.issueDate).toLocaleDateString()}</td>
                  <td style={{ color: i.status==='overdue' ? '#EF4444' : '#A0A0A0' }}>{new Date(i.dueDate).toLocaleDateString()}</td>
                  <td><span className={`badge badge-${i.status==='issued'?'blue':i.status==='overdue'?'red':'green'}`}>{i.status}</span></td>
                  <td style={{ color: i.fine > 0 ? '#EF4444' : '#606060' }}>₹{i.fine}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {issued.length === 0 && <div className="empty-state">No books currently issued</div>}
        </div>
      )}

      {tab === 'catalog' && (
        <>
          <div style={{ display:'flex', gap:8, marginBottom:14 }}>
            <input className="form-input" style={{ maxWidth:320 }} placeholder="Search by title or author…" value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} />
            <button className="btn btn-primary btn-sm" onClick={search}>Search</button>
          </div>
          <div className="card">
            <table>
              <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>ISBN</th><th>Available</th></tr></thead>
              <tbody>
                {books.map(b => (
                  <tr key={b._id}>
                    <td style={{ color:'#fff', fontWeight:500 }}>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.category || '—'}</td>
                    <td style={{ fontFamily:'monospace', fontSize:12 }}>{b.isbn}</td>
                    <td>
                      <span className={`badge badge-${b.available > 0 ? 'green' : 'red'}`}>
                        {b.available}/{b.totalCopies}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {books.length === 0 && <div className="empty-state">No books found</div>}
          </div>
        </>
      )}
    </div>
  );
}
