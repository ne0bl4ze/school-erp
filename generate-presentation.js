const PptxGenJS = require('pptxgenjs');

const pptx = new PptxGenJS();
pptx.layout = 'LAYOUT_WIDE'; // 13.33 x 7.5 inches (16:9)

// ── THEME ──────────────────────────────────────────────────
const C = {
  black:   '000000',
  surface: '111111',
  surf2:   '1A1A1A',
  border:  '2C2C2C',
  orange:  'DF740C',
  orange2: 'B85E0A',
  white:   'FFFFFF',
  muted:   '888888',
  dim:     '444444',
  green:   '22C55E',
  blue:    '3B82F6',
  red:     'EF4444',
  purple:  'A78BFA',
  codebg:  '0A0A0A',
};

const FONT = 'Calibri';
const MONO = 'Courier New';

// ── HELPERS ────────────────────────────────────────────────
function bg(slide) {
  slide.background = { color: C.black };
}

function accentBar(slide) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: C.orange } });
}

function tag(slide, text, x = 0.4, y = 0.25) {
  slide.addText(text.toUpperCase(), {
    x, y, w: 3, h: 0.3,
    fontSize: 7, bold: true, color: C.orange,
    fontFace: FONT, charSpacing: 2,
  });
}

function slideNum(slide, n, total = 14) {
  slide.addText(`${String(n).padStart(2,'0')} / ${total}`, {
    x: 12.3, y: 0.2, w: 0.9, h: 0.25,
    fontSize: 8, color: C.muted, fontFace: FONT, align: 'right',
  });
}

function heading(slide, text, x = 0.4, y = 0.7, size = 32, w = 12.5) {
  slide.addText(text, { x, y, w, h: 0.8, fontSize: size, bold: true, color: C.white, fontFace: FONT });
}

function headingAccent(slide, plain, accent, x = 0.4, y = 0.7, size = 32) {
  slide.addText([
    { text: plain,  options: { color: C.white } },
    { text: accent, options: { color: C.orange } },
  ], { x, y, w: 12.5, h: 0.9, fontSize: size, bold: true, fontFace: FONT });
}

function body(slide, text, x, y, w, h, size = 12, color = 'C0C0C0', opts = {}) {
  slide.addText(text, { x, y, w, h, fontSize: size, color, fontFace: FONT, wrap: true, ...opts });
}

function card(slide, x, y, w, h, borderColor = C.border) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: C.surface },
    line: { color: borderColor, width: 0.75 },
    rectRadius: 0.12,
  });
}

function cardDark(slide, x, y, w, h) {
  slide.addShape(pptx.ShapeType.rect, {
    x, y, w, h,
    fill: { color: C.codebg },
    line: { color: C.border, width: 0.75 },
    rectRadius: 0.1,
  });
}

function pill(slide, text, x, y, color = C.orange, bg = '1F0A00') {
  slide.addShape(pptx.ShapeType.rect, { x, y, w: text.length * 0.085 + 0.25, h: 0.26, fill: { color: bg }, line: { color: color, width: 0.5 }, rectRadius: 0.13 });
  slide.addText(text, { x: x + 0.1, y: y + 0.04, w: text.length * 0.085 + 0.1, h: 0.2, fontSize: 8, bold: true, color, fontFace: FONT });
}

function bullet(slide, items, x, y, w, size = 11) {
  const rows = items.map(i => ({ text: `▸  ${i}`, options: { color: 'C0C0C0' } }));
  slide.addText(rows, { x, y, w, h: items.length * 0.32, fontSize: size, fontFace: FONT, lineSpacingMultiple: 1.4 });
}

function codeBox(slide, lines, x, y, w, h) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: C.codebg }, line: { color: C.border, width: 0.75 }, rectRadius: 0.1 });
  slide.addText(lines, { x: x + 0.15, y: y + 0.12, w: w - 0.3, h: h - 0.24, fontSize: 8.5, fontFace: MONO, color: 'E0E0E0', wrap: true, lineSpacingMultiple: 1.5 });
}

function labelVal(slide, label, value, x, y, w = 5.5) {
  slide.addText(label.toUpperCase(), { x, y, w: 1.6, h: 0.22, fontSize: 7.5, bold: true, color: C.muted, fontFace: FONT, charSpacing: 1 });
  slide.addText(value, { x: x + 1.65, y, w: w - 1.65, h: 0.22, fontSize: 10, color: C.white, fontFace: FONT });
}

function statBox(slide, value, label, x, y) {
  slide.addText(value, { x, y, w: 1.5, h: 0.7, fontSize: 36, bold: true, color: C.orange, fontFace: FONT, align: 'center' });
  slide.addText(label.toUpperCase(), { x, y: y + 0.65, w: 1.5, h: 0.22, fontSize: 7, bold: true, color: C.muted, fontFace: FONT, align: 'center', charSpacing: 1 });
}

function divider(slide, x, y, h = 0.8) {
  slide.addShape(pptx.ShapeType.rect, { x, y, w: 0.01, h, fill: { color: C.border }, line: { color: C.border } });
}

function flowStep(slide, num, text, x, y, w = 5.8) {
  card(slide, x, y, w, 0.38);
  slide.addShape(pptx.ShapeType.ellipse, { x: x + 0.1, y: y + 0.06, w: 0.26, h: 0.26, fill: { color: '1F0A00' }, line: { color: C.orange, width: 0.5 } });
  slide.addText(num, { x: x + 0.1, y: y + 0.08, w: 0.26, h: 0.22, fontSize: 8, bold: true, color: C.orange, fontFace: FONT, align: 'center' });
  slide.addText(text, { x: x + 0.45, y: y + 0.09, w: w - 0.55, h: 0.22, fontSize: 10, color: 'C0C0C0', fontFace: FONT });
}

function crossStep(slide, text, x, y, w = 5.8) {
  card(slide, x, y, w, 0.38);
  slide.addText('✗', { x: x + 0.1, y: y + 0.07, w: 0.26, h: 0.26, fontSize: 12, bold: true, color: C.red, fontFace: FONT, align: 'center' });
  slide.addText(text, { x: x + 0.45, y: y + 0.09, w: w - 0.55, h: 0.22, fontSize: 10, color: 'C0C0C0', fontFace: FONT });
}

// ══════════════════════════════════════════════════════════
// SLIDE 1 — TITLE
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  accentBar(s);

  // Orange glow shape
  s.addShape(pptx.ShapeType.ellipse, { x: 7.5, y: 0.5, w: 6, h: 5, fill: { color: '1A0800', transparency: 30 }, line: { color: '000000', width: 0 } });

  // Logo box
  s.addShape(pptx.ShapeType.rect, { x: 10.2, y: 2.2, w: 1.2, h: 1.2, fill: { color: C.orange }, line: { color: C.orange }, rectRadius: 0.15 });
  s.addText('E', { x: 10.2, y: 2.3, w: 1.2, h: 0.9, fontSize: 48, bold: true, italic: true, color: '000000', fontFace: FONT, align: 'center' });
  s.addText('ERP Portal', { x: 10.0, y: 3.5, w: 1.6, h: 0.3, fontSize: 8, color: C.muted, fontFace: FONT, align: 'center', charSpacing: 2 });

  s.addText('TEAM PROJECT PRESENTATION', { x: 0.5, y: 1.2, w: 8, h: 0.3, fontSize: 9, bold: true, color: C.orange, fontFace: FONT, charSpacing: 3 });
  s.addText('School ERP\nManagement System', { x: 0.5, y: 1.65, w: 9, h: 2.2, fontSize: 44, bold: true, color: C.white, fontFace: FONT, lineSpacingMultiple: 1.1 });
  s.addText('A full-stack web application for managing school operations —\nattendance, grades, fees, timetables, and more.', { x: 0.5, y: 3.95, w: 8.5, h: 0.8, fontSize: 13, color: C.muted, fontFace: FONT, lineSpacingMultiple: 1.5 });

  const pills2 = [['MongoDB','1A0800'], ['Express.js','0A1220'], ['React JS','091A0E'], ['Node.js','1A0800'], ['PDFKit · Nodemailer','0F0A1A']];
  const pillColors = [C.orange, C.blue, C.green, C.orange, C.purple];
  let px = 0.5;
  pills2.forEach(([t, bg2], i) => {
    pill(s, t, px, 4.95, pillColors[i], bg2);
    px += t.length * 0.085 + 0.4;
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 2 — TEAM
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'The Team'); slideNum(s, 2);
  headingAccent(s, 'Meet the ', 'Team', 0.4, 0.55, 28);
  s.addText('Five members — each owning a distinct layer of the system', { x: 0.4, y: 1.2, w: 10, h: 0.25, fontSize: 11, color: C.muted, fontFace: FONT });

  const members = [
    { init:'A', name:'Member 1', role:'Project Lead',       duties:['Project architecture','System design','Integration & testing'] },
    { init:'B', name:'Member 2', role:'Frontend Developer', duties:['React components','UI/UX design','Routing & auth'] },
    { init:'C', name:'Member 3', role:'Backend Developer',  duties:['Express.js APIs','RBAC middleware','Route handling'] },
    { init:'D', name:'Member 4', role:'Database Engineer',  duties:['MongoDB schemas','Data modelling','Query design'] },
    { init:'E', name:'Member 5', role:'Features & DevOps',  duties:['PDF generation','Email alerts','Deployment'] },
  ];

  members.forEach((m, i) => {
    const x = 0.4 + i * 2.55;
    card(s, x, 1.55, 2.35, 3.9);
    // Avatar
    s.addShape(pptx.ShapeType.rect, { x: x + 0.8, y: 1.75, w: 0.75, h: 0.75, fill: { color: C.orange }, line: { color: C.orange2 }, rectRadius: 0.1 });
    s.addText(m.init, { x: x + 0.8, y: 1.83, w: 0.75, h: 0.55, fontSize: 22, bold: true, color: '000000', fontFace: FONT, align: 'center' });
    s.addText(m.name, { x, y: 2.62, w: 2.35, h: 0.3, fontSize: 12, bold: true, color: C.white, fontFace: FONT, align: 'center' });
    s.addText(m.role, { x, y: 2.92, w: 2.35, h: 0.25, fontSize: 9, bold: true, color: C.orange, fontFace: FONT, align: 'center' });
    s.addShape(pptx.ShapeType.rect, { x: x + 0.15, y: 3.25, w: 2.05, h: 0.01, fill: { color: C.border }, line: { color: C.border } });
    m.duties.forEach((d, j) => {
      s.addText(`▸  ${d}`, { x: x + 0.2, y: 3.35 + j * 0.35, w: 1.95, h: 0.28, fontSize: 9.5, color: 'A0A0A0', fontFace: FONT });
    });
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 3 — PROBLEM STATEMENT
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'Problem Statement'); slideNum(s, 3);
  headingAccent(s, 'Why does a school need an ', 'ERP?', 0.4, 0.55, 24);

  s.addText('Traditional schools manage registers, grade sheets, and fees manually — leading to errors, delays, and no real-time visibility.', { x: 0.4, y: 1.15, w: 6.2, h: 0.55, fontSize: 11, color: C.muted, fontFace: FONT, wrap: true, lineSpacingMultiple: 1.5 });

  const problems = [
    'Paper attendance registers — error-prone and hard to audit',
    'Fee tracking via spreadsheets — no payment history',
    'Report cards printed manually — time consuming',
    'Parents have no real-time updates on their child',
    'No centralised platform for notices',
  ];
  problems.forEach((p, i) => crossStep(s, p, 0.4, 1.78 + i * 0.47, 6.3));

  // Solutions
  card(s, 6.95, 1.3, 6.0, 1.2, C.orange);
  s.addText('CENTRALISED WEB PLATFORM', { x: 7.1, y: 1.42, w: 5.7, h: 0.22, fontSize: 8, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
  s.addText('One login for students, teachers, and admins — each seeing only what their role permits.', { x: 7.1, y: 1.68, w: 5.65, h: 0.65, fontSize: 10.5, color: 'C0C0C0', fontFace: FONT, wrap: true, lineSpacingMultiple: 1.4 });

  const sols = [
    ['REAL-TIME DATA', 'Attendance marked instantly, grades visible immediately, fees tracked with full transaction history.'],
    ['AUTOMATED ALERTS', 'Parents get email alerts for low attendance, fee confirmation, and leave decisions — via Nodemailer.'],
    ['PDF GENERATION', '3 PDF types: Report Card, Fee Receipt, Timetable — downloadable any time via PDFKit.'],
  ];
  sols.forEach(([title, text], i) => {
    card(s, 6.95, 2.63 + i * 1.1, 6.0, 1.0);
    s.addText(title, { x: 7.1, y: 2.76 + i * 1.1, w: 5.7, h: 0.22, fontSize: 8, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
    s.addText(text, { x: 7.1, y: 3.0 + i * 1.1, w: 5.65, h: 0.5, fontSize: 10, color: 'C0C0C0', fontFace: FONT, wrap: true, lineSpacingMultiple: 1.4 });
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 4 — TECH STACK
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'Tools & Technologies'); slideNum(s, 4);
  headingAccent(s, 'The ', 'MERN Stack', 0.4, 0.55, 28);

  const techs = [
    { emoji:'🍃', name:'MongoDB',       desc:'Student records, timetables, attendance logs, fee transactions, grade documents', color: C.green },
    { emoji:'⚡', name:'Express.js',    desc:'Multi-role REST APIs for all ERP modules with strict RBAC middleware', color: C.orange },
    { emoji:'⚛️', name:'React JS',      desc:'Role-specific dashboards including attendance marking and grade entry forms', color: C.blue },
    { emoji:'🟢', name:'Node.js',       desc:'PDFKit for report card generation and Nodemailer for parent email alerts', color: C.green },
    { emoji:'🔧', name:'Dev Tools',     desc:'Vite, React Router v6, Axios, JWT, bcryptjs, Mongoose ODM, Nodemon', color: C.purple },
  ];

  techs.forEach((t, i) => {
    const x = 0.4 + i * 2.55;
    card(s, x, 1.45, 2.35, 3.2);
    s.addText(t.emoji, { x, y: 1.65, w: 2.35, h: 0.5, fontSize: 26, fontFace: FONT, align: 'center' });
    s.addText(t.name, { x, y: 2.22, w: 2.35, h: 0.35, fontSize: 14, bold: true, color: t.color, fontFace: FONT, align: 'center' });
    s.addShape(pptx.ShapeType.rect, { x: x + 0.15, y: 2.63, w: 2.05, h: 0.01, fill: { color: C.border }, line: { color: C.border } });
    s.addText(t.desc, { x: x + 0.15, y: 2.73, w: 2.05, h: 1.7, fontSize: 9.5, color: C.muted, fontFace: FONT, wrap: true, lineSpacingMultiple: 1.5 });
  });

  // Stats bar
  cardDark(s, 0.4, 4.85, 12.53, 0.9);
  const stats = [['10','DB Models'],['8','API Routes'],['13','React Pages'],['3','User Roles'],['3','PDF Types']];
  stats.forEach(([v, l], i) => {
    statBox(s, v, l, 1.0 + i * 2.4, 4.85);
    if (i < 4) divider(s, 2.85 + i * 2.4, 5.05, 0.5);
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 5 — ARCHITECTURE
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'System Architecture'); slideNum(s, 5);
  headingAccent(s, 'How It All ', 'Connects', 0.4, 0.55, 28);

  // Main 3 boxes
  const boxes = [
    { x:0.4,  label:'⚛️  React Frontend',  items:['Vite + React Router','Axios HTTP Client','Context API (Auth)','CSS Modules'] },
    { x:4.65, label:'⚡  Express Backend',  items:['JWT Auth Middleware','RBAC Role Guard','REST API Routes','PDFKit · Nodemailer'], accent: true },
    { x:8.9,  label:'🍃  MongoDB Atlas',    items:['Mongoose ODM','10 Schemas','Indexes & Relations','Aggregation Pipelines'] },
  ];
  boxes.forEach(b => {
    card(s, b.x, 1.4, 3.9, 2.4, b.accent ? C.orange : C.border);
    s.addText(b.label, { x: b.x + 0.15, y: 1.58, w: 3.6, h: 0.3, fontSize: 13, bold: true, color: b.accent ? C.orange : C.white, fontFace: FONT });
    s.addShape(pptx.ShapeType.rect, { x: b.x + 0.15, y: 1.93, w: 3.6, h: 0.01, fill: { color: C.border }, line: { color: C.border } });
    b.items.forEach((item, j) => {
      s.addText(`▸  ${item}`, { x: b.x + 0.2, y: 2.05 + j * 0.37, w: 3.55, h: 0.3, fontSize: 10, color: 'C0C0C0', fontFace: FONT });
    });
  });

  // Arrows
  s.addText('→', { x: 4.35, y: 2.2, w: 0.4, h: 0.4, fontSize: 22, bold: true, color: C.orange, fontFace: FONT, align: 'center' });
  s.addText('→', { x: 8.6,  y: 2.2, w: 0.4, h: 0.4, fontSize: 22, bold: true, color: C.orange, fontFace: FONT, align: 'center' });

  // Flow cards
  const flows = [
    ['Auth Flow',  ['User submits email + password','bcrypt verifies against DB hash','JWT signed & returned to client','Stored in localStorage, sent as Bearer']],
    ['RBAC Flow',  ['JWT decoded → user role extracted','allow() middleware checks role','Student: read own data only','Teacher: mark attendance & grades']],
    ['Data Flow',  ['React page calls api.js (Axios)','Express route handles request','Controller queries via Mongoose','JSON response rendered in React']],
  ];
  flows.forEach(([title, items], i) => {
    cardDark(s, 0.4 + i * 4.32, 4.05, 4.1, 2.3);
    s.addText(title.toUpperCase(), { x: 0.55 + i * 4.32, y: 4.18, w: 3.8, h: 0.22, fontSize: 7.5, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
    items.forEach((item, j) => {
      s.addText(`▸  ${item}`, { x: 0.6 + i * 4.32, y: 4.48 + j * 0.38, w: 3.75, h: 0.3, fontSize: 9.5, color: 'C0C0C0', fontFace: FONT });
    });
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 6 — FRONTEND
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'Frontend'); slideNum(s, 6);
  headingAccent(s, 'React ', 'Frontend', 0.4, 0.55, 28);
  s.addText('Vite + React 18 · React Router v6 · Axios · CSS Modules', { x: 0.4, y: 1.18, w: 8, h: 0.25, fontSize: 11, color: C.muted, fontFace: FONT });

  // Left — structure
  card(s, 0.4, 1.5, 6.15, 2.0);
  s.addText('COMPONENT STRUCTURE', { x: 0.55, y: 1.63, w: 5.8, h: 0.22, fontSize: 7.5, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
  codeBox(s, [
    { text:'client/src/\n├── App.jsx          ← Router + protected routes\n├── context/AuthContext.jsx  ← global auth state\n├── services/api.js  ← Axios instance + interceptors\n├── components/Layout/\n│   ├── Header.jsx   Sidebar.jsx   SubNav.jsx\n└── pages/           ← 13 route pages', options: { color: 'D0D0D0' } },
  ].flatMap(x => x.text.split('\n').map(line => ({ text: line + '\n', options: { color: line.includes('←') ? C.muted : 'D0D0D0' } }))), 0.4, 1.9, 6.15, 1.45);

  // Protected route code
  card(s, 0.4, 3.5, 6.15, 1.95);
  s.addText('PROTECTED ROUTING CODE', { x: 0.55, y: 3.63, w: 5.8, h: 0.22, fontSize: 7.5, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
  codeBox(s, `function PrivateRoute({ children }) {\n  const { user, loading } = useAuth();\n  if (loading) return <Spinner />;\n  return user\n    ? children\n    : <Navigate to="/login" replace />;\n}`, 0.4, 3.88, 6.15, 1.45);

  // Right — 13 pages
  card(s, 6.75, 1.5, 6.18, 2.0);
  s.addText('13 PAGES', { x: 6.9, y: 1.63, w: 5.8, h: 0.22, fontSize: 7.5, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
  const pages = ['Dashboard','Profile','Attendance','Report Card','Timetable','Syllabus','Fees','Leave','Library','Hostel','Class Teacher','Announcements','School Blog'];
  pages.forEach((p, i) => {
    const col = i < 7 ? 0 : 1;
    const row = i < 7 ? i : i - 7;
    cardDark(s, 6.9 + col * 2.9, 1.9 + row * 0.26, 2.7, 0.22);
    s.addText(p, { x: 7.0 + col * 2.9, y: 1.94 + row * 0.26, w: 2.5, h: 0.18, fontSize: 9, color: 'A0A0A0', fontFace: FONT });
  });

  // Axios interceptor
  card(s, 6.75, 3.5, 6.18, 1.95);
  s.addText('AXIOS INTERCEPTOR', { x: 6.9, y: 3.63, w: 5.8, h: 0.22, fontSize: 7.5, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
  codeBox(s, `// Attach JWT to every request\napi.interceptors.request.use(cfg => {\n  const token = localStorage\n    .getItem('erp_token');\n  if (token)\n    cfg.headers.Authorization =\n      \`Bearer \${token}\`;\n  return cfg;\n});`, 6.75, 3.88, 6.18, 1.45);
}

// ══════════════════════════════════════════════════════════
// SLIDE 7 — KEY PAGES
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'Frontend — Key Pages'); slideNum(s, 7);
  headingAccent(s, 'Role-Specific ', 'Dashboards', 0.4, 0.55, 28);

  const pageData = [
    {
      icon:'📊', title:'Dashboard',
      points:['5 live stat cards (notices, attendance, subjects, grade, section)',
              "Today's periods fetched from timetable API",
              'Notice board with inline comment submission'],
      code:`useEffect(() => {\n  api.get('/timetable/my').then(...);\n  api.get('/announcements').then(...);\n  api.get('/attendance/my').then(...);\n}, []);`,
    },
    {
      icon:'✅', title:'Attendance',
      points:['Student view: per-subject % with colour-coded progress bars',
              'Teacher view: mark present / absent / late per student',
              'Uses role-conditional render — same route, different UI'],
      code:`// Role-conditional render\nif (user.role === 'student')\n  return <StudentView />;\nreturn <TeacherMarkingView />;`,
    },
    {
      icon:'📋', title:'Report Card',
      points:['Term 1, Term 2, Final Exam, Practical columns',
              'Auto-calculated average % and letter grade (A+ to F)',
              'One-click PDF download via Node.js PDFKit backend'],
      code:`const download = (year) =>\n  window.open(\n    \`/api/pdf/report-card/\${year}\`,\n    '_blank'\n  );`,
    },
    {
      icon:'💰', title:'Fees',
      points:['Term-wise breakdown: tuition, hostel, exam fees',
              'Payment status badges: paid / partial / unpaid',
              'Full transaction history + downloadable PDF receipt'],
      code:`// Summary computed from fee records\nconst total  = fees.reduce((a,f)=>\n  a + f.totalAmount, 0);\nconst balance = total - paid;`,
    },
  ];

  pageData.forEach((p, i) => {
    const x = 0.4 + (i % 2) * 6.45;
    const y = i < 2 ? 1.4 : 4.15;
    card(s, x, y, 6.2, 2.62);
    s.addText(`${p.icon}  ${p.title}`, { x: x + 0.15, y: y + 0.14, w: 5.9, h: 0.3, fontSize: 13, bold: true, color: C.white, fontFace: FONT });
    p.points.forEach((pt, j) => {
      s.addText(`▸  ${pt}`, { x: x + 0.2, y: y + 0.52 + j * 0.32, w: 2.95, h: 0.27, fontSize: 9.5, color: 'C0C0C0', fontFace: FONT });
    });
    codeBox(s, p.code, x + 3.25, y + 0.52, 2.8, 1.4);
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 8 — BACKEND
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'Backend'); slideNum(s, 8);
  headingAccent(s, 'Express.js ', 'Backend', 0.4, 0.55, 28);
  s.addText('RESTful API with JWT authentication and role-based access control', { x: 0.4, y: 1.18, w: 9, h: 0.25, fontSize: 11, color: C.muted, fontFace: FONT });

  // Routes list
  card(s, 0.4, 1.5, 4.65, 4.1);
  s.addText('API ROUTES', { x: 0.55, y: 1.63, w: 4.3, h: 0.22, fontSize: 7.5, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
  const routes = [
    ['/api/auth',         'POST login, register, GET me'],
    ['/api/students',     'CRUD student profiles'],
    ['/api/timetable',    'GET class timetable'],
    ['/api/attendance',   'Mark + view attendance'],
    ['/api/grades',       'Enter + view grades'],
    ['/api/fees',         'Fee records + payments'],
    ['/api/leave',        'Apply + review leave'],
    ['/api/library',      'Books + issue/return'],
    ['/api/pdf',          'Report card, receipt, timetable'],
  ];
  routes.forEach(([r, d], i) => {
    s.addText(r, { x: 0.55, y: 1.97 + i * 0.38, w: 2.1, h: 0.28, fontSize: 9, bold: true, color: C.orange, fontFace: MONO });
    s.addText(`— ${d}`, { x: 2.7, y: 1.97 + i * 0.38, w: 2.2, h: 0.28, fontSize: 9, color: C.muted, fontFace: FONT });
  });

  // JWT code
  card(s, 5.25, 1.5, 7.7, 2.0);
  s.addText('JWT AUTH MIDDLEWARE', { x: 5.4, y: 1.63, w: 7.4, h: 0.22, fontSize: 7.5, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
  codeBox(s, `const protect = async (req, res, next) => {\n  const token = req.headers\n    .authorization?.split(' ')[1];\n  const decoded = jwt.verify(\n    token, process.env.JWT_SECRET\n  );\n  req.user = await User.findById(decoded.id);\n  next();\n};`, 5.25, 1.88, 7.7, 1.5);

  // RBAC code
  card(s, 5.25, 3.62, 7.7, 2.0);
  s.addText('RBAC MIDDLEWARE — allow(...roles)', { x: 5.4, y: 3.75, w: 7.4, h: 0.22, fontSize: 7.5, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
  codeBox(s, `const allow = (...roles) => (req, res, next) => {\n  if (!roles.includes(req.user.role))\n    return res.status(403).json({\n      message: 'Access denied'\n    });\n  next();\n};\n\n// Applied on routes:\nrouter.post('/mark', protect,\n  allow('teacher', 'admin'), ctrl);`, 5.25, 4.0, 7.7, 1.6);
}

// ══════════════════════════════════════════════════════════
// SLIDE 9 — DATABASE
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'Database'); slideNum(s, 9);
  headingAccent(s, 'MongoDB ', 'Schema Design', 0.4, 0.55, 28);
  s.addText('10 Mongoose models with relationships, indexes, and pre-save hooks', { x: 0.4, y: 1.18, w: 10, h: 0.25, fontSize: 11, color: C.muted, fontFace: FONT });

  // Model boxes
  const models = ['User','Student','Course','Timetable','Attendance','Fee','Grade','Announcement','Leave','Library'];
  models.forEach((m, i) => {
    const x = 0.4 + i * 1.26;
    card(s, x, 1.5, 1.15, 0.42);
    s.addText(m, { x, y: 1.6, w: 1.15, h: 0.25, fontSize: 9, bold: true, color: C.orange, fontFace: FONT, align: 'center' });
  });

  // Grade schema
  card(s, 0.4, 2.1, 6.15, 3.65);
  s.addText('GRADE SCHEMA WITH PRE-SAVE HOOK', { x: 0.55, y: 2.23, w: 5.8, h: 0.22, fontSize: 7.5, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
  codeBox(s, `const gradeSchema = new Schema({\n  student:    { type: ObjectId, ref: 'Student' },\n  course:     { type: ObjectId, ref: 'Course'  },\n  academicYear: String,\n  term1:      Number,   // Term 1 marks\n  term2:      Number,   // Term 2 marks\n  finalExam:  Number,   // Final exam\n  practical:  Number,   // Practical / project\n  percentage: Number,   // Auto-computed\n  grade:      String,   // A+, A, B+... F\n});\n// Compute grade automatically before save\ngradeSchema.pre('save', function(next) {\n  const avg = mean([term1, term2, finalExam]);\n  this.grade = avg >= 90 ? 'A+' : avg >= 80 ?\n    'A' : avg >= 70 ? 'B+' : 'F';\n  next();\n});`, 0.4, 2.5, 6.15, 3.15);

  // Attendance bulkWrite
  card(s, 6.75, 2.1, 6.18, 3.65);
  s.addText('ATTENDANCE — BULK UPSERT', { x: 6.9, y: 2.23, w: 5.8, h: 0.22, fontSize: 7.5, bold: true, color: C.orange, fontFace: FONT, charSpacing: 1 });
  codeBox(s, `// Upsert whole class in one DB round-trip\nconst ops = records.map(\n  ({ studentId, status }) => ({\n    updateOne: {\n      filter: {\n        student: studentId,\n        course:  courseId,\n        date:    date,\n      },\n      update: { $set: { status } },\n      upsert: true,\n    }\n  })\n);\nawait Attendance.bulkWrite(ops);`, 6.75, 2.5, 6.18, 3.15);
}

// ══════════════════════════════════════════════════════════
// SLIDE 10 — PDF & EMAIL
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'Features'); slideNum(s, 10);
  headingAccent(s, 'PDF Generation & ', 'Email Alerts', 0.4, 0.55, 28);

  // PDFKit
  card(s, 0.4, 1.45, 6.15, 4.3, C.orange);
  s.addText('📄  PDFKit — 3 Document Types', { x: 0.55, y: 1.6, w: 5.8, h: 0.3, fontSize: 13, bold: true, color: C.orange, fontFace: FONT });
  const pdfs = ['Report Card — term marks, average %, letter grade, per academic year',
                'Fee Receipt — tuition/hostel/exam breakdown, payment status',
                'Timetable — landscape 5-day period grid, branded header'];
  pdfs.forEach((p, i) => s.addText(`▸  ${p}`, { x: 0.6, y: 2.02 + i * 0.35, w: 5.85, h: 0.28, fontSize: 10, color: 'C0C0C0', fontFace: FONT }));
  codeBox(s, `const doc = new PDFDocument({ size: 'A4' });\nres.setHeader('Content-Type','application/pdf');\ndoc.pipe(res); // stream directly to browser\n\n// Branded header\ndoc.rect(0,0,width,60).fill('#000000');\ndoc.fillColor('#DF740C').text('ERP',40,18);\n\n// Grade table rows\ngrades.forEach((g, i) => {\n  doc.text(g.course.name, cols[1], y+6);\n  doc.text(g.term1, cols[2], y+6);\n  y += 22;\n});\ndoc.end();`, 0.4, 3.2, 6.15, 2.38);

  // Nodemailer
  card(s, 6.75, 1.45, 6.18, 4.3);
  s.addText('📧  Nodemailer — 3 Alert Types', { x: 6.9, y: 1.6, w: 5.8, h: 0.3, fontSize: 13, bold: true, color: C.orange, fontFace: FONT });
  const mails = ['Fee confirmation → parent when fee fully paid','Attendance alert → parent when below 75%','Leave update → parent on approval / rejection'];
  mails.forEach((m, i) => s.addText(`▸  ${m}`, { x: 6.9, y: 2.02 + i * 0.35, w: 5.85, h: 0.28, fontSize: 10, color: 'C0C0C0', fontFace: FONT }));
  codeBox(s, `const transporter = nodemailer\n  .createTransport({\n    host: process.env.SMTP_HOST,\n    auth: {\n      user: process.env.SMTP_USER,\n      pass: process.env.SMTP_PASS,\n    }\n  });\n\n// Triggered after fee payment\nif (fee.status === 'paid')\n  await mailer.sendFeeReceipt(\n    student.parentEmail, data\n  );`, 6.75, 3.2, 6.18, 2.38);
}

// ══════════════════════════════════════════════════════════
// SLIDE 11 — USER ROLES
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'User Roles'); slideNum(s, 11);
  headingAccent(s, 'Three ', 'Role Types', 0.4, 0.55, 28);

  const roles = [
    {
      emoji:'🎒', name:'Student', sub:'Read-only own data', color: C.green, bg:'091A0E',
      items:['View dashboard with live stats','Check per-subject attendance %','View report card & download PDF','See class timetable & syllabus','Track fee payments & history','Apply for leave applications','View library issued books','Read school notices'],
    },
    {
      emoji:'👩‍🏫', name:'Teacher', sub:'Class management', color: C.orange, bg:'1A0800',
      items:['Mark daily attendance per subject','Enter term-wise grades for students','Post school notices & announcements','Review & approve leave applications','View class-wise student lists','Delete own announcements'],
    },
    {
      emoji:'🔑', name:'Admin', sub:'Full access', color: C.blue, bg:'0A1220',
      items:['Create & manage all user accounts','Define subjects & timetables','Record fee payments, receipts','Issue & return library books','Seed initial database data','All teacher permissions','Update student profiles','Full CRUD on all resources'],
    },
  ];

  roles.forEach((r, i) => {
    const x = 0.4 + i * 4.3;
    card(s, x, 1.45, 4.1, 5.3, r.bg);
    s.addShape(pptx.ShapeType.rect, { x: x + 0.15, y: 1.45, w: 4.1, h: 0.05, fill: { color: r.color }, line: { color: r.color }, rectRadius: 0 });
    s.addShape(pptx.ShapeType.rect, { x: x + 0.2, y: 1.68, w: 0.55, h: 0.55, fill: { color: r.bg }, line: { color: r.color, width: 0.75 }, rectRadius: 0.08 });
    s.addText(r.emoji, { x: x + 0.2, y: 1.7, w: 0.55, h: 0.45, fontSize: 20, fontFace: FONT, align: 'center' });
    s.addText(r.name, { x: x + 0.85, y: 1.72, w: 3.1, h: 0.3, fontSize: 16, bold: true, color: C.white, fontFace: FONT });
    s.addText(r.sub, { x: x + 0.85, y: 2.0, w: 3.1, h: 0.22, fontSize: 9, bold: true, color: r.color, fontFace: FONT });
    s.addShape(pptx.ShapeType.rect, { x: x + 0.2, y: 2.35, w: 3.7, h: 0.01, fill: { color: C.border }, line: { color: C.border } });
    r.items.forEach((item, j) => {
      s.addText(`▸  ${item}`, { x: x + 0.25, y: 2.48 + j * 0.39, w: 3.65, h: 0.3, fontSize: 10, color: 'C0C0C0', fontFace: FONT });
    });
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 12 — CHALLENGES
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'Implementation'); slideNum(s, 12);
  headingAccent(s, 'Challenges & ', 'Solutions', 0.4, 0.55, 28);

  const items = [
    {
      ch: "Mongoose findOneAndUpdate() bypasses pre('save') hook — seed stored plain-text passwords, breaking all logins.",
      sol:"Changed seed to use new User({...}).save() which correctly triggers the bcrypt hashing middleware.",
    },
    {
      ch:"Course model was never require()'d anywhere — populate() failed silently, leaving timetable, syllabus, and grades all empty.",
      sol:"Added all 10 model imports to index.js before routes load, ensuring Mongoose registers schemas for populate().",
    },
    {
      ch:"Vite's dev proxy strips in production builds — all frontend API calls broke after deploying to Railway + Vercel.",
      sol:"Used import.meta.env.VITE_API_URL as base URL — falls back to /api in dev, uses Railway URL in production.",
    },
    {
      ch:"macOS AirPlay Receiver permanently holds port 5000 — Express server crashed on every startup attempt.",
      sol:"Switched backend to port 8000 in .env, updated Vite proxy target to match. No system config needed.",
    },
  ];

  items.forEach((item, i) => {
    const y = 1.45 + i * 1.35;
    card(s, 0.4,  y, 5.9, 1.22);
    card(s, 6.55, y, 6.4, 1.22);

    s.addShape(pptx.ShapeType.rect, { x: 0.4, y, w: 5.9, h: 0.05, fill: { color: C.red }, line: { color: C.red } });
    s.addShape(pptx.ShapeType.rect, { x: 6.55, y, w: 6.4, h: 0.05, fill: { color: C.green }, line: { color: C.green } });

    s.addText('⚠  CHALLENGE', { x: 0.55, y: y + 0.12, w: 5.6, h: 0.22, fontSize: 7.5, bold: true, color: C.red, fontFace: FONT, charSpacing: 1 });
    s.addText('✓  SOLUTION',  { x: 6.7,  y: y + 0.12, w: 6.1, h: 0.22, fontSize: 7.5, bold: true, color: C.green, fontFace: FONT, charSpacing: 1 });
    s.addText(item.ch,  { x: 0.55, y: y + 0.38, w: 5.6,  h: 0.75, fontSize: 10, color: 'C0C0C0', fontFace: FONT, wrap: true, lineSpacingMultiple: 1.4 });
    s.addText(item.sol, { x: 6.7,  y: y + 0.38, w: 6.1,  h: 0.75, fontSize: 10, color: 'C0C0C0', fontFace: FONT, wrap: true, lineSpacingMultiple: 1.4 });

    s.addText('→', { x: 6.1, y: y + 0.45, w: 0.45, h: 0.35, fontSize: 20, bold: true, color: C.orange, fontFace: FONT, align: 'center' });
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 13 — FUTURE SCOPE
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s); accentBar(s);
  tag(s, 'Future Scope'); slideNum(s, 13);
  headingAccent(s, "What's ", 'Next', 0.4, 0.55, 28);

  const future = [
    { emoji:'📱', title:'Mobile App',          desc:'React Native app for parents — real-time push notifications for attendance, grades, and notices.' },
    { emoji:'💳', title:'Online Fee Payment',   desc:'Razorpay / Stripe integration so parents can pay fees directly and auto-receive digital receipts.' },
    { emoji:'📊', title:'Analytics Dashboard',  desc:'Admin charts showing attendance trends, subject-wise performance, and fee collection rates.' },
    { emoji:'💬', title:'Parent Portal',        desc:'Dedicated login for parents to track their child and message the class teacher directly.' },
    { emoji:'📝', title:'Online Exam Portal',   desc:'MCQ and subjective tests online — auto-graded, results pushed instantly to the report card.' },
    { emoji:'🔔', title:'SMS Alerts',           desc:'Twilio integration for SMS alerts to parents without email — attendance warnings and results.' },
  ];

  future.forEach((f, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = 0.4 + col * 4.3;
    const y = 1.45 + row * 2.35;
    card(s, x, y, 4.1, 2.15);
    s.addText(f.emoji, { x, y: y + 0.2, w: 4.1, h: 0.55, fontSize: 28, fontFace: FONT, align: 'center' });
    s.addText(f.title, { x, y: y + 0.82, w: 4.1, h: 0.3, fontSize: 13, bold: true, color: C.orange, fontFace: FONT, align: 'center' });
    s.addShape(pptx.ShapeType.rect, { x: x + 0.2, y: y + 1.18, w: 3.7, h: 0.01, fill: { color: C.border }, line: { color: C.border } });
    s.addText(f.desc, { x: x + 0.2, y: y + 1.28, w: 3.7, h: 0.75, fontSize: 10, color: C.muted, fontFace: FONT, wrap: true, lineSpacingMultiple: 1.5 });
  });
}

// ══════════════════════════════════════════════════════════
// SLIDE 14 — THANK YOU
// ══════════════════════════════════════════════════════════
{
  const s = pptx.addSlide();
  bg(s);
  accentBar(s);

  // Glow
  s.addShape(pptx.ShapeType.ellipse, { x: 3.5, y: 0.5, w: 6.5, h: 5.5, fill: { color: '0D0500', transparency: 20 }, line: { color: '000000', width: 0 } });

  // Logo
  s.addShape(pptx.ShapeType.rect, { x: 5.92, y: 0.85, w: 1.5, h: 1.5, fill: { color: C.orange }, line: { color: C.orange2 }, rectRadius: 0.18 });
  s.addText('E', { x: 5.92, y: 0.95, w: 1.5, h: 1.1, fontSize: 58, bold: true, italic: true, color: '000000', fontFace: FONT, align: 'center' });

  s.addText('Thank', { x: 3.5, y: 2.5, w: 6.33, h: 1.0, fontSize: 56, bold: true, color: C.white, fontFace: FONT, align: 'center' });
  s.addText('You', { x: 3.5, y: 3.3, w: 6.33, h: 1.0, fontSize: 56, bold: true, color: C.orange, fontFace: FONT, align: 'center' });

  s.addText('A full-stack School ERP built on the MERN stack\nmanaging attendance, grades, fees, timetables, leave, library, and automated PDF + email workflows.', {
    x: 2.2, y: 4.38, w: 8.93, h: 0.9, fontSize: 11, color: C.muted, fontFace: FONT, align: 'center', lineSpacingMultiple: 1.6,
  });

  // Final stats
  const stats = [['10','DB Models'],['8','API Routes'],['13','Pages'],['3','Roles'],['3','PDF Types']];
  stats.forEach(([v, l], i) => {
    statBox(s, v, l, 1.55 + i * 2.1, 5.6);
    if (i < 4) divider(s, 3.2 + i * 2.1, 5.8, 0.5);
  });

  s.addText('Questions? We are happy to walk through any part of the code.', {
    x: 2.5, y: 7.1, w: 8.33, h: 0.3, fontSize: 10, color: C.dim, fontFace: FONT, align: 'center',
  });
}

// ── SAVE ──────────────────────────────────────────────────
pptx.writeFile({ fileName: 'School_ERP_Presentation.pptx' })
  .then(() => console.log('✓ School_ERP_Presentation.pptx created'))
  .catch(err => console.error(err));
