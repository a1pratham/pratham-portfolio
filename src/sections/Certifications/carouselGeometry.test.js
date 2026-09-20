import { describe, it, expect } from 'vitest';
import { getArcStyle, getCardStyle, getDeckStyle } from './carouselGeometry';

describe('arc geometry', () => {
  it('makes the centre card the largest, sharpest and most opaque', () => {
    const center = getArcStyle(0);
    const side = getArcStyle(1);
    expect(center.filter).toBe('none');
    expect(center.opacity).toBe(1);
    expect(center.transform).toContain('scale(1.1)');
    expect(side.opacity).toBeLessThan(center.opacity);
    expect(side.filter).toContain('blur');
    expect(center.zIndex).toBeGreaterThan(side.zIndex);
  });

  it('mirrors left and right, pushes farther cards back and fades them out', () => {
    const left = getArcStyle(-2);
    const right = getArcStyle(2);
    expect(left.transform).toContain('translate3d(-');
    expect(right.transform).toContain('translate3d(');
    expect(right.transform).not.toContain('translate3d(-');
    expect(getArcStyle(2).opacity).toBeLessThan(getArcStyle(1).opacity);
    expect(getArcStyle(4).visibility).toBe('hidden');
  });

  it('only the front card follows the swipe drag', () => {
    expect(getArcStyle(0).transform).toContain('var(--drag');
    expect(getArcStyle(1).transform).not.toContain('var(--drag');
    expect(getDeckStyle(0).transform).toContain('var(--drag');
  });
});

describe('deck geometry', () => {
  it('stacks neighbours behind the front card and hides the rest', () => {
    expect(getDeckStyle(1).opacity).toBeLessThan(getDeckStyle(0).opacity);
    expect(getDeckStyle(3).visibility).toBe('hidden');
  });

  it('getCardStyle picks the geometry by mode', () => {
    expect(getCardStyle('arc', 1, 1200)).toEqual(getArcStyle(1, 1200));
    expect(getCardStyle('deck', 1)).toEqual(getDeckStyle(1));
  });
});
