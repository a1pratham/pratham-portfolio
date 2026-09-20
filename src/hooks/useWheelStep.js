import { useEffect, useRef } from 'react';

const CAPTURE_BAND = [0.3, 0.7];
const GESTURE_GAP_MS = 120;

/**
 * Turns mouse-wheel / trackpad scrolling over `ref` into discrete steps (-1 / +1)
 * while the element sits around the middle of the viewport. It never captures a
 * wheel event that could not move (`canStep` is false), so page scrolling resumes
 * naturally at either end. A steady or fading stream of events (trackpad inertia,
 * a spinning wheel) counts as one gesture and moves a single step.
 */
export default function useWheelStep(ref, {
  enabled = true, canStep, onStep, threshold = 40, cooldown = 700,
}) {
  const latest = useRef({ canStep, onStep });
  latest.current = { canStep, onStep };

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return undefined;

    let accumulated = 0;
    let lockedUntil = 0;
    let lastEventAt = 0;
    let lastMagnitude = 0;
    let steppedInGesture = false;

    const onWheel = (event) => {
      if (event.ctrlKey) return; // pinch-zoom
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      if (!delta) return;
      const direction = delta > 0 ? 1 : -1;

      const rect = element.getBoundingClientRect();
      const center = (rect.top + rect.bottom) / 2;
      const inBand = center > window.innerHeight * CAPTURE_BAND[0]
        && center < window.innerHeight * CAPTURE_BAND[1];
      if (!inBand || !latest.current.canStep(direction)) {
        accumulated = 0;
        return;
      }

      event.preventDefault();
      const now = performance.now();
      const magnitude = Math.abs(delta);
      const continuing = now - lastEventAt < GESTURE_GAP_MS && magnitude <= lastMagnitude * 1.15;
      lastEventAt = now;
      lastMagnitude = magnitude;
      if (!continuing) {
        steppedInGesture = false;
        accumulated = 0;
      }
      if (now < lockedUntil || steppedInGesture) return;

      accumulated += delta;
      if (Math.abs(accumulated) >= threshold) {
        accumulated = 0;
        steppedInGesture = true;
        lockedUntil = now + cooldown;
        latest.current.onStep(direction);
      }
    };

    element.addEventListener('wheel', onWheel, { passive: false });
    return () => element.removeEventListener('wheel', onWheel);
  }, [ref, enabled, threshold, cooldown]);
}
