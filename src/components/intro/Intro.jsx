import {
  useCallback, useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { home, site } from '../../data';
import useIntroProgress from '../../hooks/useIntroProgress';
import useReducedMotion from '../../hooks/useReducedMotion';
import cx from '../../utils/cx';
import { markIntroSeen, shouldPlayIntro } from '../../utils/introSession';
import styles from './Intro.module.css';
import IntroCircuit from './IntroCircuit';
import IntroProgress from './IntroProgress';
import IntroSparks from './IntroSparks';
import IntroWheel from './IntroWheel';
import createIntroSound, { isSoundSupported } from './introSound';
import StartLights from './StartLights';

// loading -> go (all lights on) -> out (lights out) -> exit (slides away) -> done
const TIMELINE = {
  normal: { go: [320, 'out'], out: [200, 'exit'], exit: [680, 'done'] },
  reduced: { go: [500, 'exit'], exit: [250, 'done'] },
};

function SpeakerIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

/**
 * Full-screen F1 intro: spinning wheel, sparks, start lights, circuit and a START-FINISH bar.
 * Plays once per browser session. Sound is opt-in (browsers block audio before a gesture).
 */
export default function Intro() {
  const [play] = useState(shouldPlayIntro);
  const [phase, setPhase] = useState(play ? 'loading' : 'done');
  const [ready, setReady] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const reduced = useReducedMotion();
  const overlayRef = useRef(null);
  const wheelRef = useRef(null);
  const circuitRef = useRef(null);
  const soundRef = useRef(null);
  const valueRef = useRef(0);
  const soundOnRef = useRef(false);
  const soundSupported = play && !reduced && isSoundSupported();

  const skip = useCallback(() => {
    setPhase((current) => (['loading', 'go', 'out'].includes(current) ? 'exit' : current));
  }, []);

  // Cover the page and hold the site's entrance animations until the intro leaves.
  useLayoutEffect(() => {
    if (!play) return undefined;
    const root = document.documentElement;
    root.dataset.intro = 'playing';
    root.style.overflow = 'hidden';
    return () => {
      delete root.dataset.intro;
      root.style.overflow = '';
    };
  }, [play]);

  // Ready = fonts and the page's own assets are in.
  useEffect(() => {
    if (!play) return undefined;
    let alive = true;
    const fonts = document.fonts?.ready ?? Promise.resolve();
    const loaded = document.readyState === 'complete'
      ? Promise.resolve()
      : new Promise((resolve) => { window.addEventListener('load', resolve, { once: true }); });
    Promise.all([fonts, loaded]).then(() => alive && setReady(true));
    return () => { alive = false; };
  }, [play]);

  const percent = useIntroProgress({
    minMs: 2100,
    enabled: play && phase === 'loading' && !reduced,
    ready,
    onFrame: (value) => {
      valueRef.current = value;
      overlayRef.current?.style.setProperty('--progress', value.toFixed(2));
      circuitRef.current?.setProgress(value);
      soundRef.current?.setProgress(value / 100);
    },
    onDone: () => setPhase('go'),
  });
  const shown = reduced ? 100 : percent;
  const lit = reduced ? 5 : Math.min(5, Math.floor(percent / 20));

  // Reduced motion: a static frame, no animation.
  useEffect(() => {
    if (!play || !reduced) return;
    overlayRef.current?.style.setProperty('--progress', '100');
    setPhase((current) => (current === 'loading' ? 'go' : current));
  }, [play, reduced]);

  useEffect(() => {
    const step = TIMELINE[reduced ? 'reduced' : 'normal'][phase];
    if (!step) return undefined;
    const id = setTimeout(() => setPhase(step[1]), step[0]);
    return () => clearTimeout(id);
  }, [phase, reduced]);

  useEffect(() => {
    if (phase === 'out') soundRef.current?.release();
    if (phase === 'exit') {
      markIntroSeen();
      delete document.documentElement.dataset.intro;
      document.documentElement.style.overflow = '';
    }
    if (phase === 'done') soundRef.current?.dispose();
  }, [phase]);

  useEffect(() => {
    if (soundOnRef.current && lit > 0 && lit <= 5) soundRef.current?.tick();
  }, [lit]);

  useEffect(() => () => soundRef.current?.dispose(), []);

  useEffect(() => {
    if (!play) return undefined;
    const overlay = overlayRef.current;
    overlay.focus();
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        skip();
      } else if (event.key === 'Tab') {
        const buttons = [...overlay.querySelectorAll('button')];
        const first = buttons[0];
        const lastButton = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          lastButton.focus();
        } else if (!event.shiftKey && document.activeElement === lastButton) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    overlay.addEventListener('keydown', onKeyDown);
    return () => overlay.removeEventListener('keydown', onKeyDown);
  }, [play, skip]);

  const toggleSound = async () => {
    if (soundOn) {
      soundRef.current.mute();
      soundOnRef.current = false;
      setSoundOn(false);
      return;
    }
    soundRef.current ??= createIntroSound();
    if (await soundRef.current.enable(valueRef.current / 100)) {
      soundOnRef.current = true;
      setSoundOn(true);
    }
  };

  if (phase === 'done') return null;

  return (
    <div
      ref={overlayRef}
      className={cx(styles.overlay, phase === 'exit' && styles.exit)}
      role="dialog"
      aria-modal="true"
      aria-label={`Loading the ${site.name} portfolio`}
      tabIndex={-1}
    >
      <div className={styles.ambient} aria-hidden="true" />
      {!reduced && <IntroSparks originRef={wheelRef} active={phase === 'loading' || phase === 'go'} />}

      <div className={styles.top}>
        <div className={styles.controls}>
          <button type="button" className={styles.button} onClick={skip}>Skip intro</button>
          {soundSupported && (
            <button type="button" className={styles.button} aria-pressed={soundOn} onClick={toggleSound}>
              <SpeakerIcon />
              <span className={styles.label}>{soundOn ? 'Sound on' : 'Sound off'}</span>
            </button>
          )}
        </div>
        <StartLights lit={lit} out={phase === 'out' || phase === 'exit'} />
        <div className={styles.circuit}>
          <IntroCircuit ref={circuitRef} initial={reduced ? 100 : 0} />
        </div>
      </div>

      <div className={styles.stage}>
        <div ref={wheelRef} className={styles.wheelBox}>
          <IntroWheel />
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.identity}>
          <p className={styles.name}>{site.name}</p>
          <p className={styles.role}>{home.headline}</p>
        </div>
        <IntroProgress percent={shown} />
      </div>
    </div>
  );
}
