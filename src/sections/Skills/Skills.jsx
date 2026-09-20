import Section from '../../components/layout/Section/Section';
import Reveal from '../../components/ui/Reveal/Reveal';
import { skills } from '../../data';
import SkillGroup from './SkillGroup';
import styles from './Skills.module.css';

export default function Skills() {
  return (
    <Section id="skills" eyebrow="03 / Skills" title="Tools I work with.">
      <Reveal className={styles.intro}>
        {skills.intro.map((line) => <p key={line}>{line}</p>)}
      </Reveal>
      <div className={styles.grid}>
        {skills.groups.map((group, index) => (
          <SkillGroup key={group.title} group={group} delay={index * 90} />
        ))}
      </div>
    </Section>
  );
}
