import PropTypes from 'prop-types';
import Reveal from '../../components/ui/Reveal/Reveal';
import cx from '../../utils/cx';
import styles from './EducationItem.module.css';

function CapIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="m2 9 10-5 10 5-10 5z" />
      <path d="M6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5" />
      <path d="M22 9v6" />
    </svg>
  );
}

function Grades({ grades, fallback }) {
  if (!grades) return <p className={styles.fallback}>{fallback}</p>;
  return (
    <dl className={styles.grades} aria-label={grades.metric}>
      {grades.scores.map(({ label, value, scale }) => (
        <div key={label} className={styles.grade}>
          <dt>{`${grades.metric} · ${label}`}</dt>
          <dd>
            {value}
            {scale && <span>{` / ${scale}`}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

Grades.propTypes = {
  fallback: PropTypes.string.isRequired,
  grades: PropTypes.shape({
    metric: PropTypes.string,
    scores: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string, value: PropTypes.string, scale: PropTypes.string,
    })),
  }),
};

export default function EducationItem({ item, delay = 0 }) {
  const {
    period, inProgress, degree, institution, results, grades,
  } = item;

  return (
    <Reveal as="li" className={cx(styles.item, inProgress && styles.current)} delay={delay}>
      <p className={styles.period}>{period}</p>
      <div className={styles.rail} aria-hidden="true">
        <span className={styles.node} />
        <span className={styles.line} />
      </div>
      <article className={styles.card} aria-label={degree}>
        <div className={styles.head}>
          <span className={styles.icon}><CapIcon /></span>
          {inProgress && <span className={styles.badge}>In progress</span>}
        </div>
        <h3 className={styles.degree}>{degree}</h3>
        <p className={styles.institution}>{institution.name}</p>
        {(institution.affiliation || institution.location) && (
          <p className={styles.meta}>
            {[institution.affiliation, institution.location].filter(Boolean).join(' · ')}
          </p>
        )}
        <Grades grades={grades} fallback={results} />
      </article>
    </Reveal>
  );
}

EducationItem.propTypes = {
  delay: PropTypes.number,
  item: PropTypes.shape({
    period: PropTypes.string.isRequired,
    inProgress: PropTypes.bool,
    degree: PropTypes.string.isRequired,
    institution: PropTypes.shape({
      name: PropTypes.string, affiliation: PropTypes.string, location: PropTypes.string,
    }).isRequired,
    results: PropTypes.string,
    grades: Grades.propTypes.grades,
  }).isRequired,
};
