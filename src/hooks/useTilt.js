import { useEffect } from 'react';
import { hasFinePointer } from '../utils/capabilities';
import useReducedMotion from './useReducedMotion';

/**
 * Publishes pointer position (--px/--py, %) and a small tilt (--rx/--ry, deg)
 * on the element for CSS to consume. No-op on touch devices / reduced motion.
 */
export default function useTilt(ref, { max = 4 } = {}) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (reducedMotion || !element || !hasFinePointer()) return undefined;

    const reset = () => ['--px', '--py', '--rx', '--ry'].forEach((name) => element.style.removeProperty(name));
    const onMove = (event) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      element.style.setProperty('--px', `${x * 100}%`);
      element.style.setProperty('--py', `${y * 100}%`);
      element.style.setProperty('--rx', `${(0.5 - y) * max * 2}deg`);
      element.style.setProperty('--ry', `${(x - 0.5) * max * 2}deg`);
    };

    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', reset);
    return () => {
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [ref, reducedMotion, max]);
}
