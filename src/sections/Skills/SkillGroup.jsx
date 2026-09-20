import PropTypes from 'prop-types';
import Reveal from '../../components/ui/Reveal/Reveal';
import SkillIcon from '../../components/ui/SkillIcon/SkillIcon';
import { projects } from '../../data';
import { getSkillProjects } from '../../utils/skills';
import styles from './SkillGroup.module.css';

export default function SkillGroup({ group, delay }) {
  const headingId = `skills-${group.title.toLowerCase().replace(/[^a-z]+/g, '-')}`;
  return (
    <Reveal as="article" className={styles.group} delay={delay} aria-labelledby={headingId}>
      <h3 id={headingId} className={styles.title}>{group.title}</h3>
      <ul className={styles.items}>
        {group.items.map(({ title, icon }) => {
          const usedIn = getSkillProjects(title, projects);
          return (
            <li key={title} className={styles.item}>
              <span className={styles.icon}><SkillIcon name={icon} /></span>
              <span className={styles.text}>
                <span className={styles.name}>{title}</span>
                {usedIn.length > 0 && (
                  <span className={styles.usage}>
                    Used in
                    {' '}
                    {usedIn.map((project) => project.name).join(', ')}
                  </span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}

SkillGroup.propTypes = {
  delay: PropTypes.number,
  group: PropTypes.shape({
    title: PropTypes.string.isRequired,
    items: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
    })).isRequired,
  }).isRequired,
};
