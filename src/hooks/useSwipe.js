import { useEffect, useRef } from 'react';

const DRAG_START_PX = 8;
const SWIPE_DISTANCE_PX = 50;
const SWIPE_VELOCITY = 0.4; // px per ms

/**
 * Horizontal touch/pen swipe. While dragging it publishes --drag (px) and
 * data-dragging on the element; vertical page scrolling is left to the browser
 * (pair with `touch-action: pan-y`). Mouse input is ignored on purpose.
 */
export default function useSwipe(ref, { enabled = true, canStep, onSwipe }) {
  const latest = useRef({ canStep, onSwipe });
  latest.current = { canStep, onSwipe };

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return undefined;

    let start = null;
    let dragging = false;

    const reset = () => {
      element.style.removeProperty('--drag');
      delete element.dataset.dragging;
      start = null;
      dragging = false;
    };

    const onDown = (event) => {
      if (event.pointerType === 'mouse') return;
      start = { x: event.clientX, y: event.clientY, time: event.timeStamp };
    };

    const onMove = (event) => {
      if (!start) return;
      const dx = event.clientX - start.x;
      const dy = event.clientY - start.y;
      if (!dragging) {
        if (Math.abs(dx) < DRAG_START_PX || Math.abs(dx) < Math.abs(dy)) return;
        dragging = true;
        element.dataset.dragging = 'true';
        element.setPointerCapture?.(event.pointerId);
      }
      const blocked = !latest.current.canStep(dx < 0 ? 1 : -1);
      element.style.setProperty('--drag', `${blocked ? dx * 0.25 : dx}px`);
    };

    const onUp = (event) => {
      if (!start) return;
      const dx = event.clientX - start.x;
      const velocity = Math.abs(dx) / Math.max(1, event.timeStamp - start.time);
      const wasDragging = dragging;
      reset();
      if (wasDragging && (Math.abs(dx) > SWIPE_DISTANCE_PX || velocity > SWIPE_VELOCITY)) {
        const direction = dx < 0 ? 1 : -1;
        if (latest.current.canStep(direction)) latest.current.onSwipe(direction);
      }
    };

    element.addEventListener('pointerdown', onDown);
    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerup', onUp);
    element.addEventListener('pointercancel', reset);
    return () => {
      element.removeEventListener('pointerdown', onDown);
      element.removeEventListener('pointermove', onMove);
      element.removeEventListener('pointerup', onUp);
      element.removeEventListener('pointercancel', reset);
      reset();
    };
  }, [ref, enabled]);
}
