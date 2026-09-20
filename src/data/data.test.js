import { describe, it, expect } from 'vitest';
import {
  certifications, education, projects, skills,
} from './index';
import skillIcons from './skillIcons';

describe('data layer', () => {
  it('normalises projects from the JSON source', () => {
    expect(projects.map((project) => project.id)).toEqual(['feedbook', 'manganest']);
    projects.forEach((project) => {
      expect(project.bullets.length).toBeGreaterThan(0);
      expect(project.links[0].href).toMatch(/^https:\/\/github\.com\/a1pratham\//);
    });
  });

  it('exposes education and certifications', () => {
    expect(education).toHaveLength(2);
    expect(certifications).toHaveLength(4);
  });
});

describe('about data', () => {
  it('splits the about text into two short paragraphs', async () => {
    const { about } = await import('./index');
    expect(about.paragraphs).toHaveLength(2);
  });
});

describe('skills data', () => {
  it('has an icon definition for every skill', () => {
    skills.groups.flatMap((group) => group.items).forEach(({ title, icon }) => {
      expect(skillIcons[icon], `${title} -> ${icon}`).toBeTruthy();
    });
  });

  it('uses root-relative project image paths', () => {
    projects.forEach((project) => expect(project.image).toMatch(/^\/images\/projects\//));
  });
});
