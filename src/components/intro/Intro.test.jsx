import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import Intro from './Intro';

const mockReducedMotion = (reduce) => {
  window.matchMedia = (query) => ({
    matches: query.includes('prefers-reduced-motion') ? reduce : false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
};

// Each phase schedules the next timeout from an effect, so step time in small acts.
const advance = async (ms, step = 100) => {
  for (let elapsed = 0; elapsed < ms; elapsed += step) {
    // eslint-disable-next-line no-await-in-loop
    await act(async () => { await vi.advanceTimersByTimeAsync(step); });
  }
};

describe('Intro', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    window.sessionStorage.clear();
    mockReducedMotion(false);
  });
  afterEach(() => {
    vi.useRealTimers();
    window.sessionStorage.setItem('portfolio:intro-seen', '1');
    mockReducedMotion(false);
    delete document.documentElement.dataset.intro;
    document.documentElement.style.overflow = '';
  });

  it('shows the name, role, progress bar and a skip control on the first visit', () => {
    render(<Intro />);
    const dialog = screen.getByRole('dialog', { name: /loading the pratham ukey portfolio/i });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Pratham Ukey')).toBeInTheDocument();
    expect(screen.getByText('Backend & full-stack developer')).toBeInTheDocument();
    expect(screen.getByRole('progressbar', { name: /loading portfolio/i })).toHaveAttribute('aria-valuemin', '0');
    expect(screen.getByRole('button', { name: /skip intro/i })).toBeInTheDocument();
    expect(document.documentElement.dataset.intro).toBe('playing');
    expect(document.documentElement.style.overflow).toBe('hidden');
  });

  it('finishes on its own, releases scroll and remembers the session', async () => {
    render(<Intro />);
    await advance(8000);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.documentElement.style.overflow).toBe('');
    expect(document.documentElement.dataset.intro).toBeUndefined();
    expect(window.sessionStorage.getItem('portfolio:intro-seen')).toBe('1');
  });

  it('can be skipped with the button and with Escape', async () => {
    const { unmount } = render(<Intro />);
    fireEvent.click(screen.getByRole('button', { name: /skip intro/i }));
    expect(document.documentElement.style.overflow).toBe('');
    await advance(1000);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    unmount();

    window.sessionStorage.clear();
    render(<Intro />);
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    await advance(1000);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps keyboard focus inside the intro', () => {
    render(<Intro />);
    const skip = screen.getByRole('button', { name: /skip intro/i });
    skip.focus();
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Tab' });
    expect(document.activeElement).toBe(skip);
  });

  it('does not play again in the same session', () => {
    window.sessionStorage.setItem('portfolio:intro-seen', '1');
    render(<Intro />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.documentElement.dataset.intro).toBeUndefined();
  });

  it('respects reduced motion: no canvas, no sound control, quick exit', async () => {
    mockReducedMotion(true);
    const { container } = render(<Intro />);
    expect(container.querySelector('canvas')).toBeNull();
    expect(screen.queryByRole('button', { name: /sound/i })).not.toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    await advance(1200);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
