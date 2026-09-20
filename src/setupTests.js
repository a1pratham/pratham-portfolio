import '@testing-library/jest-dom';
import { vi } from 'vitest';

// The one-time intro is covered by its own tests; keep it out of every other test.
window.sessionStorage.setItem('portfolio:intro-seen', '1');

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
