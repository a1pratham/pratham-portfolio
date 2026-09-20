# Phase 5 - Education, Contact, Footer (merge notes)

Paths mirror the project root. Only new/changed files are included.

## New
- `src/sections/Education/` (Education, EducationItem + css, test)
- `src/sections/Contact/` (Contact, ContactLink, CopyEmailButton + css, test)
- `src/data/education.js`, `src/data/contact.js` (normalise your existing JSON; no new content)
- `src/utils/grades.js`, `src/utils/social.js` (+ tests)
- `src/hooks/useCopyToClipboard.js`
- `src/components/layout/Footer/Footer.test.jsx`

## Replaced / edited existing files
- `src/components/layout/Footer/Footer.jsx` + `Footer.module.css` - full replacement (now takes an optional `links` prop)
- `src/App.jsx` - one line: `<Footer links={navLinks} />`
- `src/sections/index.js` - adds Education (before Certifications) and Contact (last)
- `src/sections/Certifications/Certifications.jsx` - eyebrow renumbered `04` -> `05`
- `src/App.test.jsx` - the About assertion is scoped to `#about` (the MCA text now also appears in Education)

## Notes
- `public/images/education/lorem-ipsum.png` is no longer used and can be deleted.
- Navbar needed no change: six links + Resume fit from 900px up (measured).
- The email address, LinkedIn/GitHub handles and resume link all come from `social.json` / `site.js`.
