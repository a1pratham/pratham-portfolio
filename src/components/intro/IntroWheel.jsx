import { useId } from 'react';
import styles from './IntroWheel.module.css';

const VENTS = Array.from({ length: 12 }, (_, index) => index * 30);
const TICKS = Array.from({ length: 36 }, (_, index) => index * 10);
const NUT = Array.from({ length: 6 }, (_, index) => {
  const angle = (Math.PI / 3) * index;
  return `${(26 * Math.cos(angle)).toFixed(1)},${(26 * Math.sin(angle)).toFixed(1)}`;
}).join(' ');

/**
 * Generic F1-style wheel (no real branding): slick tyre with a coloured sidewall band, vented
 * wheel cover and a single centre nut. The sharp details spin up and fade into low-contrast
 * soft streaks, so the fast spin never produces flicker.
 */
export default function IntroWheel() {
  const uid = useId().replace(/:/g, '');
  const ids = {
    tyre: `tyre-${uid}`, face: `face-${uid}`, nut: `nut-${uid}`, gloss: `gloss-${uid}`, clip: `clip-${uid}`,
  };

  return (
    <div className={styles.wheel} aria-hidden="true">
      <svg className={styles.layer} viewBox="0 0 400 400" focusable="false">
        <defs>
          <radialGradient id={ids.tyre} cx="50%" cy="50%" r="50%">
            <stop offset="62%" stopColor="#1c1c21" />
            <stop offset="90%" stopColor="#0e0e10" />
            <stop offset="100%" stopColor="#040405" />
          </radialGradient>
          <radialGradient id={ids.face} cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#34343c" />
            <stop offset="100%" stopColor="#15151a" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="190" fill={`url(#${ids.tyre})`} />
        <circle cx="200" cy="200" r="189" fill="none" stroke="rgb(255 255 255 / 10%)" strokeWidth="2" />
        <circle cx="200" cy="200" r="172" fill="none" strokeWidth="7" style={{ stroke: 'var(--accent)' }} />
        <circle cx="200" cy="200" r="160" fill="none" stroke="rgb(255 255 255 / 14%)" strokeWidth="1" />
        <circle cx="200" cy="200" r="132" fill="#0a0a0c" />
        <circle cx="200" cy="200" r="128" fill="none" stroke="#8a8a94" strokeWidth="2" />
        <circle cx="200" cy="200" r="120" fill={`url(#${ids.face})`} />
      </svg>

      <svg className={`${styles.layer} ${styles.details}`} viewBox="0 0 400 400" focusable="false">
        <g transform="translate(200 200)">
          {VENTS.map((angle) => (
            <rect key={angle} x="-7" y="-106" width="14" height="36" rx="7" fill="#08080a" stroke="rgb(255 255 255 / 18%)" strokeWidth="1" transform={`rotate(${angle})`} />
          ))}
          {TICKS.map((angle) => (
            <rect key={angle} x="-1" y="-118" width="2" height="6" fill="rgb(255 255 255 / 30%)" transform={`rotate(${angle})`} />
          ))}
        </g>
      </svg>

      <div className={styles.streaks} />

      <svg className={styles.layer} viewBox="0 0 400 400" focusable="false">
        <defs>
          <linearGradient id={ids.nut} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d8d8de" />
            <stop offset="55%" stopColor="#7c7c86" />
            <stop offset="100%" stopColor="#3a3a42" />
          </linearGradient>
          <linearGradient id={ids.gloss} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <clipPath id={ids.clip}>
            <circle cx="200" cy="200" r="190" />
          </clipPath>
        </defs>
        <circle cx="200" cy="200" r="58" fill="#0f0f12" strokeWidth="3" style={{ stroke: 'var(--accent)' }} />
        <g transform="translate(200 200)">
          <polygon points={NUT} fill={`url(#${ids.nut})`} stroke="#15151a" strokeWidth="2" />
          <circle r="10" fill="#0a0a0c" />
          <rect x="-3" y="-25" width="6" height="9" rx="2" fill="#0a0a0c" />
          <rect x="-3" y="16" width="6" height="9" rx="2" fill="#0a0a0c" />
        </g>
        <g clipPath={`url(#${ids.clip})`}>
          <ellipse cx="140" cy="110" rx="150" ry="62" transform="rotate(-38 140 110)" fill={`url(#${ids.gloss})`} />
        </g>
      </svg>
    </div>
  );
}
