import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom implements neither matchMedia nor IntersectionObserver.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }),
});

globalThis.IntersectionObserver = class IntersectionObserverMock {
  observe = vi.fn();

  unobserve = vi.fn();

  disconnect = vi.fn();
};
