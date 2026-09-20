import Section from '../../components/layout/Section/Section';
import education from '../../data/education';
import EducationItem from './EducationItem';
import styles from './Education.module.css';

export default function Education() {
  return (
    <Section id="education" eyebrow="04 / Education" title="Where I've studied.">
      <ol className={styles.timeline}>
        {education.map((item, index) => (
          <EducationItem key={item.id} item={item} delay={index * 120} />
        ))}
      </ol>
    </Section>
  );
}
