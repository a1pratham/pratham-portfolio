import PropTypes from 'prop-types';
import Icon from '../../components/ui/Icon/Icon';
import RichText from '../../components/ui/RichText/RichText';
import styles from './CertificateCard.module.css';

function PlaceholderArt() {
  return (
    <div className={styles.placeholder} aria-hidden="true">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="10" width="52" height="36" rx="4" />
        <path d="M14 20h24M14 27h16" />
        <circle cx="46" cy="36" r="6" />
        <path d="m42.5 41-2 11 5.5-3 5.5 3-2-11" />
      </svg>
      <span>Preview coming soon</span>
    </div>
  );
}

export default function CertificateCard({ certificate, interactive }) {
  const {
    id, title, issuer, date, summary, image, href,
  } = certificate;
  const tabIndex = interactive ? 0 : -1;
  const noteId = `${id}-note`;

  return (
    <article className={styles.card} aria-label={title}>
      <div className={styles.preview}>
        {image
          ? <img src={image} alt={`${title} certificate`} loading="lazy" decoding="async" />
          : <PlaceholderArt />}
        {date && <span className={styles.date}>{date}</span>}
      </div>

      <div className={styles.meta}>
        <p className={styles.issuer}>{issuer}</p>
        <h3 className={styles.title}>{title}</h3>
        {summary && <RichText text={summary} className={styles.summary} />}

        {href ? (
          <a
            className={styles.action}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={tabIndex}
            aria-label={`View Certificate: ${title} (opens in a new tab)`}
          >
            View Certificate
            <Icon name="arrow" size={16} />
          </a>
        ) : (
          <>
            <button
              type="button"
              className={styles.action}
              aria-disabled="true"
              aria-describedby={noteId}
              tabIndex={tabIndex}
              onClick={(event) => event.preventDefault()}
            >
              View Certificate
            </button>
            <span id={noteId} className="visually-hidden">The certificate file is not available yet.</span>
          </>
        )}
      </div>
    </article>
  );
}

CertificateCard.propTypes = {
  interactive: PropTypes.bool,
  certificate: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    issuer: PropTypes.string.isRequired,
    date: PropTypes.string,
    summary: PropTypes.string,
    image: PropTypes.string,
    href: PropTypes.string,
  }).isRequired,
};
