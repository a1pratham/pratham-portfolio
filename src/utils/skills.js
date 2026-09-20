import skillAliases from '../data/skillAliases';

const normalize = (text) => text.toLowerCase().replace(/\s+\d+(\.\d+)*$/, '').trim();

/** Projects whose tags mention the skill (ignoring version suffixes like "React 19"). */
export function getSkillProjects(skillTitle, projects) {
  const names = [skillTitle, ...(skillAliases[skillTitle] ?? [])].map(normalize);
  return projects.filter((project) => project.tags.some((tag) => names.includes(normalize(tag))));
}

export default getSkillProjects;
