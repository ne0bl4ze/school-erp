import { useState } from 'react';
import styles from './SubNav.module.css';

const ITEMS = ['Personal', 'Academic', 'Communication', 'Fees Payment', 'Hostel'];

export default function SubNav() {
  const [active, setActive] = useState(0);
  return (
    <nav className={styles.subnav}>
      {ITEMS.map((item, i) => (
        <button
          key={item}
          className={`${styles.item} ${active === i ? styles.active : ''}`}
          onClick={() => setActive(i)}
        >
          {item}
          {i < 3 && <span className={styles.arrow}>▾</span>}
        </button>
      ))}
    </nav>
  );
}
