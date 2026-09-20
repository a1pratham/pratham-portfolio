import { slugify } from '../utils/text';
import certificateAssets from './certificateAssets';
import certificationsJson from './certifications.json';

/** Certifications joined with their (optional) asset files. */
const certificates = certificationsJson.experiences.map((item) => {
  const id = slugify(item.title);
  const { image = null, file = null } = certificateAssets[id] ?? {};
  return {
    id,
    title: item.title,
    issuer: item.subtitle,
    date: item.dateText,
    summary: item.workDescription[0] ?? '',
    image,
    href: file ?? image,
  };
});

export default certificates;
