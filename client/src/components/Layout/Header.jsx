import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { user, logout } = useAuth();
  const initials = user?.name?.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'U';

  return (
    <header className={styles.header}>
      <a href="/" className={styles.logo}>
        <div className={styles.logoMark}>E</div>
        <div className={styles.logoWordmark}>
          <span className={styles.logoName}>ERP</span>
          <span className={styles.logoSub}>Student Portal</span>
        </div>
      </a>

      <div className={styles.headerIcons}>
        <button className={styles.iconBtn} title="Notifications">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className={styles.notifDot}></span>
        </button>
        <button className={styles.iconBtn} title="Apps">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
          </svg>
        </button>
      </div>

      <div className={styles.spacer} />

      <div className={styles.headerUser}>
        <div className={styles.userText}>
          <div className={styles.userName}>{user?.name}</div>
          <div className={styles.userRole}>{user?.role}</div>
        </div>
        <div className={styles.avatar}>{initials}</div>
        <button className={styles.gearBtn} onClick={logout} title="Logout">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </header>
  );
}
