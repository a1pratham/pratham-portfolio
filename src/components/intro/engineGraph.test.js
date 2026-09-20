import {
  describe, it, expect, vi,
} from 'vitest';
import { createEngineGraph, engineFrequency } from './engineGraph';

const param = () => ({
  value: 0,
  setTargetAtTime: vi.fn(),
  setValueAtTime: vi.fn(),
  linearRampToValueAtTime: vi.fn(),
});
const node = () => {
  const params = {};
  return new Proxy({ connect: vi.fn(), start: vi.fn(), stop: vi.fn() }, {
    get: (target, key) => {
      if (key in target) return target[key];
      params[key] ??= param();
      return params[key];
    },
  });
};
const fakeContext = () => ({
  currentTime: 0,
  sampleRate: 100,
  createGain: node,
  createOscillator: node,
  createBiquadFilter: node,
  createDynamicsCompressor: node,
  createBufferSource: node,
  createBuffer: (channels, length) => ({ getChannelData: () => new Float32Array(length) }),
});

describe('engine sound graph', () => {
  it('pitch rises with progress and stays in a sane range', () => {
    expect(engineFrequency(0)).toBe(70);
    expect(engineFrequency(1)).toBe(370);
    expect(engineFrequency(0.5)).toBeGreaterThan(engineFrequency(0.2));
    expect(engineFrequency(5)).toBe(370);
  });

  it('starts once and can be driven, ticked, released and stopped', () => {
    const ctx = fakeContext();
    const graph = createEngineGraph(ctx, node());
    expect(() => {
      graph.start();
      graph.start();
      graph.setProgress(0.5);
      graph.tick();
      graph.release();
      graph.setMuted(true);
      graph.stop();
    }).not.toThrow();
  });
});
