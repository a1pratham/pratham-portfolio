import PropTypes from 'prop-types';
import Icon from '../../components/ui/Icon/Icon';
import styles from './ContactLink.module.css';

export default function ContactLink({
  icon, label, handle, href,
}) {
  return (
    <a className={styles.link} href={href} target="_blank" rel="noopener noreferrer">
      <span className={styles.icon}><Icon name={icon} /></span>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        <span className={styles.handle}>{handle}</span>
      </span>
      <span className={styles.arrow}><Icon name="arrow" size={18} /></span>
    </a>
  );
}

ContactLink.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  handle: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};
