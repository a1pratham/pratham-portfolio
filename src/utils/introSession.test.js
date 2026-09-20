import {
  describe, it, expect, beforeEach, vi, afterEach,
} from 'vitest';
import { markIntroSeen, shouldPlayIntro } from './introSession';

describe('introSession', () => {
  beforeEach(() => window.sessionStorage.clear());
  afterEach(() => {
    vi.restoreAllMocks();
    window.location.hash = '';
  });

  it('plays on the first visit of a session and not after it was seen', () => {
    expect(shouldPlayIntro()).toBe(true);
    markIntroSeen();
    expect(shouldPlayIntro()).toBe(false);
  });

  it('never plays for crawlers or Lighthouse', () => {
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 (compatible; Googlebot/2.1)');
    expect(shouldPlayIntro()).toBe(false);
    window.navigator.userAgent; // eslint-disable-line no-unused-expressions
    vi.spyOn(window.navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 Chrome-Lighthouse');
    expect(shouldPlayIntro()).toBe(false);
  });

  it('skips the intro for deep links', () => {
    window.location.hash = '#contact';
    expect(shouldPlayIntro()).toBe(false);
  });

  it('still plays when storage is blocked', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('blocked'); });
    expect(shouldPlayIntro()).toBe(true);
  });
});
