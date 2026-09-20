import {
  describe, it, expect, vi, beforeEach, afterEach,
} from 'vitest';
import { act, renderHook } from '@testing-library/react';
import useIntroProgress from './useIntroProgress';

describe('useIntroProgress', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  const run = (props) => {
    const onDone = vi.fn();
    const frames = [];
    const hook = renderHook((p) => useIntroProgress({
      enabled: true, onDone, onFrame: (v) => frames.push(v), ...p,
    }), { initialProps: props });
    return { ...hook, onDone, frames };
  };

  it('counts up to 100 and finishes once when the page is ready', () => {
    const { result, onDone, frames } = run({ ready: true, minMs: 1000 });
    act(() => { vi.advanceTimersByTime(2000); });
    expect(result.current).toBe(100);
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(frames.every((v, i) => i === 0 || v >= frames[i - 1])).toBe(true);
  });

  it('holds below 92% until the page is ready', () => {
    const { result, rerender, onDone } = run({ ready: false, minMs: 1000 });
    act(() => { vi.advanceTimersByTime(3000); });
    expect(result.current).toBeLessThanOrEqual(92);
    expect(onDone).not.toHaveBeenCalled();
    rerender({ ready: true, minMs: 1000 });
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current).toBe(100);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('never traps the visitor: finishes after maxMs even if not ready', () => {
    const { result, onDone } = run({ ready: false, minMs: 500, maxMs: 2000 });
    act(() => { vi.advanceTimersByTime(4000); });
    expect(result.current).toBe(100);
    expect(onDone).toHaveBeenCalledTimes(1);
  });

  it('does nothing while disabled', () => {
    const onDone = vi.fn();
    const { result } = renderHook(() => useIntroProgress({ enabled: false, ready: true, onDone }));
    act(() => { vi.advanceTimersByTime(5000); });
    expect(result.current).toBe(0);
    expect(onDone).not.toHaveBeenCalled();
  });
});
