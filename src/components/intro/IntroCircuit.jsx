import {
  forwardRef, useEffect, useImperativeHandle, useRef,
} from 'react';
import PropTypes from 'prop-types';
import styles from './IntroCircuit.module.css';

// An original circuit outline; the start/finish line sits at the left end of the main straight.
const TRACK = 'M 34 104 L 112 104 C 134 104 150 98 152 86 C 154 72 140 68 126 70 L 110 73 C 98 75 92 65 100 59 C 108 53 124 55 136 47 C 152 37 156 19 138 14 L 72 14 C 52 14 42 22 44 34 C 46 46 62 46 64 58 C 66 72 44 70 36 80 C 28 90 22 104 34 104 Z';

/** White track that fills red (coral) as progress advances; `ref.setProgress(0-100)`. */
const IntroCircuit = forwardRef(({ initial = 0 }, ref) => {
  const trackRef = useRef(null);
  const fillRef = useRef(null);
  const tipRef = useRef(null);
  const lengthRef = useRef(0);

  const setProgress = (value) => {
    fillRef.current.style.strokeDashoffset = String(100 - value);
    const tip = tipRef.current;
    if (!lengthRef.current) return;
    if (value <= 0 || value >= 100) {
      tip.style.opacity = '0';
      return;
    }
    const point = trackRef.current.getPointAtLength((lengthRef.current * value) / 100);
    tip.setAttribute('cx', point.x.toFixed(1));
    tip.setAttribute('cy', point.y.toFixed(1));
    tip.style.opacity = '1';
  };

  useImperativeHandle(ref, () => ({ setProgress }), []);

  useEffect(() => {
    lengthRef.current = trackRef.current.getTotalLength?.() ?? 0;
    setProgress(initial);
  }, [initial]);

  return (
    <svg className={styles.circuit} viewBox="0 0 200 130" fill="none" aria-hidden="true" focusable="false">
      <path ref={trackRef} d={TRACK} className={styles.track} pathLength="100" />
      <path ref={fillRef} d={TRACK} className={styles.fill} pathLength="100" />
      <line x1="34" y1="96" x2="34" y2="112" className={styles.line} />
      <circle ref={tipRef} r="4.5" className={styles.tip} />
    </svg>
  );
});

IntroCircuit.displayName = 'IntroCircuit';
IntroCircuit.propTypes = { initial: PropTypes.number };

export default IntroCircuit;
