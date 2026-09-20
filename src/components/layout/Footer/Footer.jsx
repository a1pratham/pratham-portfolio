import PropTypes from 'prop-types';
import { home, site } from '../../../data';
import Icon from '../../ui/Icon/Icon';
import SocialLinks from '../../ui/SocialLinks/SocialLinks';
import styles from './Footer.module.css';

export default function Footer({ links = [] }) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <img src={site.logo.src} alt="" width="40" height="40" loading="lazy" />
          <div>
            <p className={styles.name}>{site.name}</p>
            <p className={styles.tagline}>{home.headline}</p>
          </div>
        </div>

        {links.length > 0 && (
          <nav aria-label="Footer">
            <ul className={styles.links}>
              {links.map(({ id, label }) => (
                <li key={id}><a href={`#${id}`}>{label}</a></li>
              ))}
            </ul>
          </nav>
        )}

        <SocialLinks label="Footer social links" />
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>
          ©
          {' '}
          {new Date().getFullYear()}
          {' '}
          {site.name}
        </p>
        <a className={styles.top} href="#top">
          Back to top
          <span className={styles.up}><Icon name="arrow" size={16} /></span>
        </a>
      </div>
    </footer>
  );
}

Footer.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
};
