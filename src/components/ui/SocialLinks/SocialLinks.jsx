import PropTypes from 'prop-types';
import { social } from '../../../data';
import Icon from '../Icon/Icon';
import styles from './SocialLinks.module.css';

const LABELS = { github: 'GitHub', linkedin: 'LinkedIn', email: 'Email' };

export default function SocialLinks({ label = 'Social links' }) {
  return (
    <ul className={styles.list} aria-label={label}>
      {social.map(({ network, href }) => (
        <li key={network}>
          <a
            className={styles.link}
            href={href}
            aria-label={LABELS[network] ?? network}
            {...(href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          >
            <Icon name={network} />
          </a>
        </li>
      ))}
    </ul>
  );
}

SocialLinks.propTypes = { label: PropTypes.string };
