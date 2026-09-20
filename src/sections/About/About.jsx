import Section from '../../components/layout/Section/Section';
import Reveal from '../../components/ui/Reveal/Reveal';
import RichText from '../../components/ui/RichText/RichText';
import { about } from '../../data';
import styles from './About.module.css';

export default function About() {
  return (
    <Section id="about" eyebrow="01 / About" title="Building systems end to end.">
      <div className={styles.copy}>
        {about.paragraphs.map((text, index) => (
          <Reveal key={text} delay={index * 90}>
            <RichText text={text} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
