import { useEffect, useRef, useState } from 'react';

const easeOut = (t) => 1 - (1 - t) ** 2.2;
const HOLD_BELOW = 92;

/**
 * Drives the intro progress (0-100). It follows a fixed rev-up curve, but never passes
 * 92% until `ready` is true (fonts + page load), so the bar cannot finish before the
 * site is usable. `maxMs` is a hard stop so a slow asset can never trap the visitor.
 * `onFrame` receives the smooth value every frame; the returned state is the whole percent.
 */
export default function useIntroProgress({
  enabled, ready, minMs = 2300, maxMs = 6500, ratePerSec = 130, onFrame, onDone,
}) {
  const [percent, setPercent] = useState(0);
  const latest = useRef({ ready, onFrame, onDone });
  latest.current = { ready, onFrame, onDone };

  useEffect(() => {
    if (!enabled) return undefined;
    let frame = 0;
    let value = 0;
    const start = performance.now();
    let last = start;

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const elapsed = now - start;
      const cap = latest.current.ready || elapsed > maxMs ? 100 : HOLD_BELOW;
      const target = Math.min(easeOut(Math.min(1, elapsed / minMs)) * 100, cap);
      value = Math.min(target, value + ratePerSec * dt);
      const finished = value >= 99.9;
      if (finished) value = 100;
      latest.current.onFrame?.(value);
      setPercent(Math.floor(value));
      if (finished) {
        latest.current.onDone();
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled, minMs, maxMs, ratePerSec]);

  return percent;
}
