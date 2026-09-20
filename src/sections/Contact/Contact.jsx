import Section from '../../components/layout/Section/Section';
import Button from '../../components/ui/Button/Button';
import Reveal from '../../components/ui/Reveal/Reveal';
import {
  email, mailto, profileLinks, resumeLink,
} from '../../data/contact';
import { home } from '../../data';
import ContactLink from './ContactLink';
import CopyEmailButton from './CopyEmailButton';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <Section id="contact" eyebrow="06 / Contact" title="Let's talk.">
      <Reveal className={styles.panel}>
        <p className={styles.lead}>
          I&apos;m looking for opportunities to contribute as a Software Engineer.
        </p>
        <p className={styles.body}>
          If you have a role, a project or a question, I&apos;d like to hear from you.
        </p>
        <p className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          {home.status}
        </p>

        <div className={styles.actions}>
          <Button href={mailto} icon="email" magnetic>Email me</Button>
          <CopyEmailButton email={email} />
        </div>

        <ul className={styles.links}>
          {profileLinks.map(({
            network, label, handle, href,
          }) => (
            <li key={network}>
              <ContactLink icon={network} label={label} handle={handle} href={href} />
            </li>
          ))}
          <li>
            <ContactLink icon="download" label={resumeLink.label} handle={resumeLink.handle} href={resumeLink.href} />
          </li>
        </ul>
      </Reveal>
    </Section>
  );
}
