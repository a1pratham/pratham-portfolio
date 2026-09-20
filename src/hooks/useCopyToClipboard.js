import {
  useCallback, useEffect, useRef, useState,
} from 'react';

/** status: 'idle' | 'copied' | 'failed' (resets itself after `resetMs`). */
export default function useCopyToClipboard(resetMs = 2200) {
  const [status, setStatus] = useState('idle');
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = useCallback(async (text) => {
    let next = 'copied';
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      next = 'failed';
    }
    setStatus(next);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus('idle'), resetMs);
  }, [resetMs]);

  return { status, copy };
}
