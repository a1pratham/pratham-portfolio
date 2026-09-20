import { describe, it, expect } from 'vitest';
import { getEmailAddress, getHandle } from './social';

describe('social utils', () => {
  it('extracts the address from a mailto link', () => {
    expect(getEmailAddress('mailto:me@example.com?subject=Hi')).toBe('me@example.com');
  });

  it('extracts a handle from a profile URL', () => {
    expect(getHandle('https://github.com/a1pratham')).toBe('a1pratham');
    expect(getHandle('https://linkedin.com/in/justpratham/')).toBe('in/justpratham');
  });
});
