import aboutJson from './about.json';
import certificationsJson from './certifications.json';
import educationJson from './education.json';
import home from './home.json';
import projectsJson from './projects.json';
import skillsJson from './skills.json';
import socialJson from './social.json';
import { slugify, toBullets } from '../utils/text';

export { default as site } from './site';
export { home };

export const about = {
  paragraphs: aboutJson.about.split(/\n{2,}/).map((text) => text.trim()).filter(Boolean),
};

export const { social } = socialJson;
export const { education } = educationJson;
export const certifications = certificationsJson.experiences;
export const skills = {
  intro: skillsJson.intro.split('\n').map((line) => line.trim()).filter(Boolean),
  groups: skillsJson.skills,
};

export const projects = projectsJson.projects.map((project) => {
  const [name, ...rest] = project.title.split(' - ');
  return {
    id: slugify(name),
    name,
    tagline: rest.join(' - '),
    image: `/${project.image}`,
    imageAlt: `${name} preview`,
    bullets: toBullets(project.bodyText),
    links: project.links,
    tags: project.tags,
  };
});
