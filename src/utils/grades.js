/**
 * Parses strings like "GPA - 7.79 (Semester I), 7.34 (Semester II)" or
 * "CGPA - 7.76 / 10" into { metric, scores }. Returns null when the text
 * does not follow that shape so callers can fall back to the raw string.
 */
export function parseGrades(text) {
  const match = text.match(/^\s*([A-Za-z]+)\s*-\s*(.+)$/);
  if (!match) return null;
  const [, metric, rest] = match;
  const scores = rest.split(/,\s*/).map((part) => {
    const score = part.match(/^([\d.]+)\s*(?:\/\s*(\d+))?\s*(?:\((.+)\))?\s*$/);
    return score ? { value: score[1], scale: score[2] ?? null, label: score[3] ?? 'Overall' } : null;
  });
  return scores.every(Boolean) ? { metric, scores } : null;
}

/** "Name (Affiliation), City" -> { name, affiliation, location } */
export function parseInstitution(text) {
  const match = text.match(/^(.*?)\s*\((.*?)\)\s*,?\s*(.*)$/);
  return match
    ? { name: match[1], affiliation: match[2], location: match[3] }
    : { name: text, affiliation: '', location: '' };
}
