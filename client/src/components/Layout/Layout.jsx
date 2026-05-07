import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import SubNav from './SubNav';
import styles from './Layout.module.css';

export default function Layout() {
  return (
    <div className={styles.app}>
      <Header />
      <SubNav />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
