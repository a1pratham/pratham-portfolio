import {
  describe, it, expect, vi, beforeEach,
} from 'vitest';
import { renderHook } from '@testing-library/react';
import useWheelStep from './useWheelStep';

function setup({ canStep = () => true, centerY = 384 } = {}) {
  const element = document.createElement('div');
  element.getBoundingClientRect = () => ({ top: centerY - 100, bottom: centerY + 100 });
  document.body.append(element);
  const onStep = vi.fn();
  renderHook(() => useWheelStep({ current: element }, { canStep, onStep }));
  const wheel = (deltaY) => {
    const event = new WheelEvent('wheel', { deltaY, cancelable: true, bubbles: true });
    element.dispatchEvent(event);
    return event;
  };
  return { onStep, wheel };
}

describe('useWheelStep', () => {
  beforeEach(() => {
    window.innerHeight = 768;
    vi.spyOn(performance, 'now').mockReturnValue(1000);
  });

  it('steps once per wheel notch and captures the event', () => {
    const { onStep, wheel } = setup();
    const event = wheel(100);
    expect(onStep).toHaveBeenCalledWith(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores further wheel events while settling', () => {
    const { onStep, wheel } = setup();
    wheel(100);
    wheel(100);
    expect(onStep).toHaveBeenCalledTimes(1);
  });

  it('treats a steady stream as one gesture, then steps again after a pause', () => {
    let now = 1000;
    performance.now.mockImplementation(() => now);
    const { onStep, wheel } = setup();
    [1000, 1100, 1200, 1300, 1400, 1500, 1600, 1700, 1800].forEach((time) => {
      now = time;
      wheel(100);
    });
    expect(onStep).toHaveBeenCalledTimes(1);
    now = 2400;
    wheel(100);
    expect(onStep).toHaveBeenCalledTimes(2);
  });

  it('lets the page scroll when the carousel cannot move that way', () => {
    const { onStep, wheel } = setup({ canStep: (direction) => direction < 0 });
    const event = wheel(100);
    expect(onStep).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });

  it('lets the page scroll when the carousel is not near the middle of the viewport', () => {
    const { onStep, wheel } = setup({ centerY: 40 });
    const event = wheel(100);
    expect(onStep).not.toHaveBeenCalled();
    expect(event.defaultPrevented).toBe(false);
  });
});
