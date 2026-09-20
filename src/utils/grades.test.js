import { describe, it, expect } from 'vitest';
import { parseGrades, parseInstitution } from './grades';

describe('parseGrades', () => {
  it('parses per-semester GPAs', () => {
    expect(parseGrades('GPA - 7.79 (Semester I), 7.34 (Semester II)')).toEqual({
      metric: 'GPA',
      scores: [
        { value: '7.79', scale: null, label: 'Semester I' },
        { value: '7.34', scale: null, label: 'Semester II' },
      ],
    });
  });

  it('parses a CGPA with a scale', () => {
    expect(parseGrades('CGPA - 7.76 / 10')).toEqual({
      metric: 'CGPA', scores: [{ value: '7.76', scale: '10', label: 'Overall' }],
    });
  });

  it('returns null for text it does not understand', () => {
    expect(parseGrades('First class with distinction')).toBeNull();
    expect(parseGrades('GPA - excellent')).toBeNull();
  });
});

describe('parseInstitution', () => {
  it('splits name, affiliation and location', () => {
    expect(parseInstitution("Bharati Vidyapeeth's IMIT (Affiliated with Mumbai University), Navi Mumbai")).toEqual({
      name: "Bharati Vidyapeeth's IMIT",
      affiliation: 'Affiliated with Mumbai University',
      location: 'Navi Mumbai',
    });
  });

  it('falls back to the whole string', () => {
    expect(parseInstitution('Some College')).toEqual({ name: 'Some College', affiliation: '', location: '' });
  });
});
