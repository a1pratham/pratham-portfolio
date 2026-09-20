import { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/ui/Button/Button';
import Chip from '../../components/ui/Chip/Chip';
import Icon from '../../components/ui/Icon/Icon';
import Reveal from '../../components/ui/Reveal/Reveal';
import RichText from '../../components/ui/RichText/RichText';
import useMediaQuery from '../../hooks/useMediaQuery';
import useTilt from '../../hooks/useTilt';
import cx from '../../utils/cx';
import styles from './ProjectCard.module.css';

const ICONS = { github: 'github' };

export default function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  useTilt(cardRef);
  const isWide = useMediaQuery('(min-width: 900px)');
  const [open, setOpen] = useState(isWide);
  const [summary, ...details] = project.bullets;
  const titleId = `${project.id}-title`;
  const detailsId = `${project.id}-details`;

  return (
    <Reveal>
      <article
        ref={cardRef}
        className={cx(styles.card, index % 2 === 1 && styles.flip)}
        aria-labelledby={titleId}
      >
        <div className={styles.media}>
          <div className={styles.frame}>
            <div className={styles.chrome} aria-hidden="true"><i /><i /><i /></div>
            <img
              src={project.image}
              alt={project.imageAlt}
              width="1400"
              height="700"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className={styles.body}>
          <p className={styles.kicker}>
            {String(index + 1).padStart(2, '0')}
            {' / '}
            {project.tagline}
          </p>
          <h3 id={titleId} className={styles.title}>{project.name}</h3>
          <RichText text={summary} className={styles.summary} />

          <div id={detailsId} className={cx(styles.details, open && styles.open)}>
            <ul className={styles.features}>
              {details.map((text) => <li key={text}><RichText text={text} as="span" /></li>)}
            </ul>
          </div>
          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls={detailsId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? 'Hide' : 'Show'}
            {' '}
            key features
            <Icon name="chevron" size={16} />
          </button>

          <ul className={styles.tags} aria-label={`${project.name} technologies`}>
            {project.tags.map((tag) => <Chip key={tag}>{tag}</Chip>)}
          </ul>

          <div className={styles.actions}>
            {project.links.map(({ text, href }) => (
              <Button
                key={href}
                href={href}
                variant="ghost"
                size="sm"
                icon={ICONS[text.toLowerCase()] ?? 'arrow'}
                ariaLabel={`${project.name} on ${text}`}
                external
              >
                {text}
              </Button>
            ))}
          </div>
        </div>
      </article>
    </Reveal>
  );
}

ProjectCard.propTypes = {
  index: PropTypes.number.isRequired,
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tagline: PropTypes.string,
    image: PropTypes.string.isRequired,
    imageAlt: PropTypes.string.isRequired,
    bullets: PropTypes.arrayOf(PropTypes.string).isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    links: PropTypes.arrayOf(PropTypes.shape({
      text: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};
