import PropTypes from 'prop-types';
import Reveal from '../../ui/Reveal/Reveal';
import styles from './Section.module.css';

export default function Section({
  id, eyebrow, title, children,
}) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className="container">
        <Reveal as="header" className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={`${id}-title`} className={styles.title}>{title}</h2>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

Section.propTypes = {
  id: PropTypes.string.isRequired,
  eyebrow: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};
