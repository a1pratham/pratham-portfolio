import { describe, it, expect } from 'vitest';
import { parseInline, slugify, toBullets } from './text';

describe('text utils', () => {
  it('parses **bold** segments', () => {
    expect(parseInline('Built **Spring Boot** APIs')).toEqual([
      { text: 'Built ', bold: false },
      { text: 'Spring Boot', bold: true },
      { text: ' APIs', bold: false },
    ]);
  });

  it('turns a dash-list block into bullets', () => {
    expect(toBullets('- one\n - two\n')).toEqual(['one', 'two']);
  });

  it('slugifies names', () => {
    expect(slugify('Manga Nest!')).toBe('manga-nest');
  });
});
