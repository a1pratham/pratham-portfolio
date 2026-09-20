import { parseGrades, parseInstitution } from '../utils/grades';
import { slugify } from '../utils/text';
import educationJson from './education.json';

const education = educationJson.education.map((item) => ({
  id: slugify(item.cardTitle),
  period: item.title,
  inProgress: /expected/i.test(item.title),
  degree: item.cardTitle,
  institution: parseInstitution(item.cardSubtitle),
  results: item.cardDetailedText,
  grades: parseGrades(item.cardDetailedText),
}));

export default education;
