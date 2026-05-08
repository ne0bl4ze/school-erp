import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const ICONS = {
  grid:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>,
  user:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  book:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  clock:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  check:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>,
  chart:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
  bookmark:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>,
  dollar:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  calendar:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  home:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  users:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  bell:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  msg:     <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  award:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>,
  file:    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  trending:<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
};

const NAV_BY_ROLE = {
  principal: [
    { to:'/',               label:'Dashboard',        icon:'grid'     },
    { to:'/academic-years', label:'Academic Years',   icon:'calendar' },
    { to:'/admissions',     label:'Admissions',       icon:'file'     },
    { to:'/school-students',label:'Students',         icon:'users'    },
    { to:'/promotions',     label:'Promotions',       icon:'trending' },
    { to:'/messages',       label:'Messages',         icon:'msg'      },
    { to:'/announcements',  label:'Announcements',    icon:'bell'     },
    { to:'/profile',        label:'Profile',          icon:'user'     },
  ],
  admin: [
    { to:'/',               label:'Dashboard',        icon:'grid'     },
    { to:'/academic-years', label:'Academic Years',   icon:'calendar' },
    { to:'/admissions',     label:'Admissions',       icon:'file'     },
    { to:'/school-students',label:'Students',         icon:'users'    },
    { to:'/promotions',     label:'Promotions',       icon:'trending' },
    { to:'/messages',       label:'Messages',         icon:'msg'      },
    { to:'/announcements',  label:'Announcements',    icon:'bell'     },
    { to:'/profile',        label:'Profile',          icon:'user'     },
  ],
  teacher: [
    { to:'/',               label:'Dashboard',        icon:'grid'     },
    { to:'/my-classes',     label:'My Classes',       icon:'book'     },
    { to:'/attendance',     label:'Mark Attendance',  icon:'check'    },
    { to:'/grades',         label:'Enter Grades',     icon:'chart'    },
    { to:'/leave',          label:'Leave Review',     icon:'calendar' },
    { to:'/messages',       label:'Messages',         icon:'msg'      },
    { to:'/timetable',      label:'Timetable',        icon:'clock'    },
    { to:'/school-students',label:'Students',         icon:'users'    },
    { to:'/announcements',  label:'Announcements',    icon:'bell'     },
    { to:'/profile',        label:'Profile',          icon:'user'     },
  ],
  student: [
    { to:'/',               label:'Dashboard',        icon:'grid'     },
    { to:'/profile',        label:'Profile',          icon:'user'     },
    { to:'/syllabus',       label:'Syllabus',         icon:'book'     },
    { to:'/timetable',      label:'Time Table',       icon:'clock'    },
    { to:'/attendance',     label:'Attendance',       icon:'check'    },
    { to:'/grades',         label:'Report Card',      icon:'chart'    },
    { to:'/library',        label:'Library',          icon:'bookmark' },
    { to:'/fees',           label:'Fees Details',     icon:'dollar'   },
    { to:'/leave',          label:'Leave Details',    icon:'calendar' },
    { to:'/hostel',         label:'Hostel',           icon:'home'     },
    { to:'/mentor',         label:'Class Teacher',    icon:'users'    },
    { to:'/announcements',  label:'Announcements',    icon:'bell'     },
    { to:'/blogs',          label:'School Blogs',     icon:'msg'      },
  ],
  parent: [
    { to:'/',                label:'Dashboard',        icon:'grid'     },
    { to:'/child-attendance',label:"Child's Attendance",icon:'check'  },
    { to:'/child-grades',    label:"Child's Grades",   icon:'chart'   },
    { to:'/child-fees',      label:"Child's Fees",     icon:'dollar'  },
    { to:'/child-timetable', label:"Child's Timetable",icon:'clock'   },
    { to:'/parent-messages', label:'Messages',         icon:'msg'     },
    { to:'/announcements',   label:'Notices',          icon:'bell'    },
    { to:'/profile',         label:'Profile',          icon:'user'    },
  ],
};

export default function Sidebar() {
  const { user, profile } = useAuth();
  const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';
  const nav = NAV_BY_ROLE[user?.role] || NAV_BY_ROLE.student;

  const userCardSub = () => {
    if (user?.role === 'student' && profile?.admissionNo) return (
      <>
        <span className={styles.ucRoll}>{profile.admissionNo}</span>
        <span>Grade {profile.grade} – {profile.section}</span>
        {profile.stream && profile.stream !== 'General' && <span>{profile.stream}</span>}
      </>
    );
    if (user?.role === 'teacher' && profile?.courses) return (
      <span>{profile.courses.length} subject{profile.courses.length !== 1 ? 's' : ''} assigned</span>
    );
    if (user?.role === 'principal' || user?.role === 'admin') return (
      <>
        <span>{profile?.studentCount || 0} students enrolled</span>
        <span>{profile?.teacherCount || 0} teachers</span>
      </>
    );
    if (user?.role === 'parent' && profile?.children?.length) return (
      <span>Parent of {profile.children.map(c => c.user?.name || 'Child').join(', ')}</span>
    );
    return null;
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.userCard}>
        <div className={styles.ucAvatar}>{initials}</div>
        <div className={styles.ucInfo}>
          <div className={styles.ucName}>{user?.name}</div>
          <div className={styles.ucMeta}>{userCardSub()}</div>
        </div>
      </div>

      <nav className={styles.navGroup}>
        {nav.map(({ to, label, icon }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
          >
            <span className={styles.navIcon}>{ICONS[icon]}</span>
            <span className={styles.navLabel}>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
