import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { site } from '../../../data';
import useActiveSection from '../../../hooks/useActiveSection';
import useScrolled from '../../../hooks/useScrolled';
import cx from '../../../utils/cx';
import Button from '../../ui/Button/Button';
import styles from './Navbar.module.css';

export default function Navbar({ links }) {
  const [open, setOpen] = useState(false);
  const scrolled = useScrolled();
  const active = useActiveSection(links.map((link) => link.id));

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={cx(styles.header, (scrolled || open) && styles.solid)}>
      <nav className={cx('container', styles.nav)} aria-label="Primary">
        <a className={styles.brand} href="#top" onClick={close}>
          <img src={site.logo.src} alt="" width="32" height="32" />
          <span>{site.name}</span>
        </a>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="nav-menu"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="visually-hidden">{open ? 'Close menu' : 'Open menu'}</span>
          <span className={styles.bars} aria-hidden="true" />
        </button>

        <ul id="nav-menu" className={cx(styles.menu, open && styles.open)}>
          {links.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={styles.link}
                aria-current={active === id ? 'true' : undefined}
                onClick={close}
              >
                {label}
              </a>
            </li>
          ))}
          <li className={styles.resume}>
            <Button href={site.resume.href} variant="ghost" size="sm" icon="download" external>
              {site.resume.label}
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  );
}

Navbar.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })).isRequired,
};
