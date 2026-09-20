import { describe, it, expect } from 'vitest';
import { getSkillProjects } from './skills';

const projects = [
  { name: 'A', tags: ['Java 21', 'Spring Boot 3.5', 'React 19', 'PostgreSQL'] },
  { name: 'B', tags: ['Java', 'Android SDK'] },
];

describe('getSkillProjects', () => {
  it('ignores version suffixes when matching tags', () => {
    expect(getSkillProjects('React', projects).map((p) => p.name)).toEqual(['A']);
    expect(getSkillProjects('Spring Boot', projects).map((p) => p.name)).toEqual(['A']);
  });

  it('uses aliases such as Core Java -> Java', () => {
    expect(getSkillProjects('Core Java', projects).map((p) => p.name)).toEqual(['A', 'B']);
  });

  it('returns nothing for skills that no project tags mention', () => {
    expect(getSkillProjects('Git & GitHub', projects)).toEqual([]);
  });
});
