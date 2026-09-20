/** Splits "**bold** text" into [{ text, bold }] segments. */
export function parseInline(text) {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => (part.startsWith('**') && part.endsWith('**')
      ? { text: part.slice(2, -2), bold: true }
      : { text: part, bold: false }));
}

/** Turns a "- item\n - item" block into a clean array of strings. */
export function toBullets(block) {
  return block
    .split('\n')
    .map((line) => line.replace(/^\s*-\s*/, '').trim())
    .filter(Boolean);
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}
