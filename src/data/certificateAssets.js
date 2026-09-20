/**
 * Certificate files, keyed by certificate id (the slug of its title in
 * certifications.json). This is the only place to touch when you add real files.
 *
 *   1. Put the files in /public/certificates/
 *   2. Fill in the paths below, e.g.
 *        'introduction-to-sql': {
 *          image: '/certificates/introduction-to-sql.webp', // preview shown on the card
 *          file: '/certificates/introduction-to-sql.pdf',   // opened by "View Certificate"
 *        },
 *
 * `file` falls back to `image` when omitted. Leave both null to keep the placeholder.
 */
const certificateAssets = {
  'java-programming-certification': {
    image: '/certificates/java.jpg',
    file: null,
  },

  'introduction-to-sql': {
    image: '/certificates/sql.jpg',
    file: null,
  },

  'generative-ai-proficiency': {
    image: '/certificates/gen_ai.jpg',
    file: null,
  },

  'fundamental-python-programming': {
    image: '/certificates/python.jpg',
    file: null,
  },
};

export default certificateAssets;
