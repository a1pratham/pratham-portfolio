import { useEffect } from 'react';
import { hasFinePointer } from '../utils/capabilities';
import useReducedMotion from './useReducedMotion';

/** Nudges the element toward the cursor via --mx/--my (consumed with CSS `translate`). */
export default function useMagnetic(ref, { enabled = true, strength = 0.3 } = {}) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!enabled || reducedMotion || !element || !hasFinePointer()) return undefined;

    const reset = () => {
      element.style.removeProperty('--mx');
      element.style.removeProperty('--my');
    };
    const onMove = (event) => {
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      element.style.setProperty('--mx', `${dx * strength}px`);
      element.style.setProperty('--my', `${dy * strength}px`);
    };

    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', reset);
    return () => {
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerleave', reset);
      reset();
    };
  }, [ref, enabled, reducedMotion, strength]);
}
