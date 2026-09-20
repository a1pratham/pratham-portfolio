# Phase 6 - Polish and QA (merge notes)

Paths mirror the project root. Only new/changed files are included.

## Delete these from your project (unused after this phase)
- `public/images/about/profile.png`
- `public/images/education/lorem-ipsum.png`
- `public/images/logo.png`
- `public/images/projects/feedbook-poster.png`
- `public/images/projects/manganest-poster.png`

## What changed
- **Fonts self-hosted:** `public/fonts/*`, `src/styles/fonts.css` (imported in `src/main.jsx`); Google Fonts links removed from `index.html`, fonts preloaded.
- **Share card:** `public/og-image.jpg` (1200x630). `config/seoPlugin.js` now points at it (it used to point at a poster PNG) and also injects Person `url`/`image` when `VITE_SITE_URL` is set.
- **Images:** `profile.png` (really a JPEG) -> `profile.webp`; `logo.png` -> `logo.webp` (nav/footer) + `favicon-32.png`, `apple-touch-icon.png`, `icon-192.png`; `manifest.json` updated. References updated in `about.json`, `site.js`, `data.test.js`.
- **Data cleanup:** removed the unused `icon` entries from `education.json`.
- **Accessibility fix:** About's status pill is now a valid `dt`/`dd` pair (axe reported an invalid definition list).
- **Docs/tooling:** full `README.md`, `.env.example`, `engines` in `package.json`.

## When the domain is live
Set `VITE_SITE_URL=https://prathamukey.in` as a build environment variable on your host and redeploy.
