import { useCallback, useState } from 'react';
import Button from '../../components/ui/Button/Button';
import Chip from '../../components/ui/Chip/Chip';
import Reveal from '../../components/ui/Reveal/Reveal';
import { home, site, social } from '../../data';
import useReducedMotion from '../../hooks/useReducedMotion';
import { canRenderScene } from '../../utils/capabilities';
import cx from '../../utils/cx';
import styles from './Hero.module.css';
import HeroScene from './HeroScene';

const findSocial = (network) => social.find((item) => item.network === network)?.href;

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const [sceneReady, setSceneReady] = useState(false);
  const handleReady = useCallback(() => setSceneReady(true), []);
  const showScene = !reducedMotion && canRenderScene();

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={cx(styles.fallback, sceneReady && styles.fallbackHidden)} aria-hidden="true" />
      {showScene && <HeroScene onReady={handleReady} />}

      <div className={cx('container', styles.content)}>
        <Reveal as="p" className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          {home.status}
        </Reveal>
        <Reveal as="h1" id="hero-title" className={styles.title} delay={80}>
          Hi, I&apos;m
          {' '}
          <span className={styles.name}>{home.name}</span>
        </Reveal>
        <Reveal as="p" className={styles.headline} delay={160}>{home.headline}</Reveal>
        <Reveal as="ul" className={styles.focus} aria-label="Primary technologies" delay={220}>
          {home.focus.map((item) => <Chip key={item}>{item}</Chip>)}
        </Reveal>
        <Reveal className={styles.actions} delay={300}>
          <Button href="#projects" icon="arrow" magnetic>View projects</Button>
          <Button href={findSocial('github')} variant="ghost" icon="github" external magnetic>GitHub</Button>
          <Button href={site.resume.href} variant="ghost" icon="download" external magnetic>Resume</Button>
          <Button href={findSocial('email')} variant="ghost" icon="email" magnetic>Contact me</Button>
        </Reveal>
      </div>

      <a className={styles.cue} href="#about">
        <span className="visually-hidden">Scroll to About</span>
        <span className={styles.cueLine} aria-hidden="true" />
      </a>
    </section>
  );
}
