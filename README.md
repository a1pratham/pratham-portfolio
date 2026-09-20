# Pratham Ukey - Portfolio

Personal developer portfolio built with **React 18 + Vite** and a lazy-loaded **three.js** hero.
Single page, dark theme, no backend. All content lives in data files, so updating the site rarely
means touching components.

## Quick start

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build -> build/
npm run preview    # serve the production build
npm test           # vitest
npm run lint       # eslint
```

> If `npm install` fails with `Cannot read properties of null (reading 'edgesOut')`, you are on an
> older npm 10 build. Use npm 11: `npx npm@11 install`.

## Project structure

```
src/
  components/
    intro/    one-time F1 intro (wheel, sparks, lights, circuit, progress, synthesised sound)
    layout/   Navbar, Footer, Section, Background
    ui/       Button, Chip, Icon, Reveal, RichText, SkillIcon, SocialLinks, SkipLink
  sections/   Hero, About, Projects, Skills, Education, Certifications, Contact
              index.js = render order, anchor ids and which sections appear in the nav
  data/       content (JSON) + small modules that normalise it for the UI
  hooks/      scroll reveal, active section, magnetic buttons, tilt, wheel/swipe, media queries
  utils/      pure helpers (text parsing, grades, skills matching)
  styles/     fonts.css, tokens.css (design tokens), base.css
public/       fonts, images, resume PDF, certificate files, favicons, og-image.jpg
config/       seoPlugin.js (canonical/OG tags, sitemap, robots when a domain is set)
```

## Editing content

| What | File |
| --- | --- |
| Name, status line, headline, hero technology chips | `src/data/home.json` |
| About paragraphs (`**bold**` supported; separate with a blank line) | `src/data/about.json` |
| Projects (title as `Name - Tagline`, bullets, links, tags, poster) | `src/data/projects.json`, `public/images/projects/` |
| Skill groups | `src/data/skills.json` (icon keys map to `skillIcons.js`, project matching to `skillAliases.js`) |
| Education | `src/data/education.json` |
| Certification titles, issuers, years | `src/data/certifications.json` |
| Certificate images / PDFs | `src/data/certificateAssets.js` + `public/certificates/` |
| Email, LinkedIn, GitHub | `src/data/social.json` |
| Resume PDF | `public/resume/Pratham_Ukey_Resume.pdf` (path set in `src/data/site.js`) |

**Adding a certificate file:** copy it to `public/certificates/`, then in `certificateAssets.js` set
`image` (preview shown on the card) and/or `file` (opened by "View Certificate"). Until then the card
shows a placeholder and a disabled button.

**Adding a live demo:** add `{ "text": "Live demo", "href": "https://..." }` to the project's `links`
array in `projects.json`. Every link in that array is rendered as a button on the card.

## Intro animation

`src/components/intro/` holds a one-time F1-style intro: a spinning wheel with sparks and tyre smoke,
five start lights, a circuit that fills as the page loads, and a START to FINISH bar. It follows the
palette tokens and the real load state (fonts + page load), and never blocks longer than a few seconds.

- Plays once per browser session. Skipped for deep links (`/#contact`), crawlers/Lighthouse and, as a
  short static frame, for `prefers-reduced-motion`. Visitors can skip with the button or Esc.
- **Sound is opt-in.** Browsers block audio until a click/tap, so the intro shows a "Sound off" button;
  pressing it starts a synthesised engine rev (Web Audio, no audio files). Nothing plays automatically.
- To remove it, delete `<Intro />` from `src/App.jsx`. To replay it while developing, clear the
  `portfolio:intro-seen` key in sessionStorage (or open a new tab).

## Changing the colours

The whole palette lives in `src/styles/tokens.css`: `--bg`, `--text`, `--accent`, `--accent-2` and their
`-rgb` twins (used for translucent glows and borders). The 3D hero scene reads `--accent` / `--accent-2`
at runtime, so it follows automatically. Two things sit outside the CSS: the `theme-color` in
`index.html` / `public/manifest.json`, and the share card `public/og-image.jpg` (an image, regenerate it).
After a change, re-check text contrast (aim for 4.5:1 or better).

## Domain, SEO and social preview

Everything domain-specific is switched on by one environment variable, so nothing needs editing when
the domain goes live:

```bash
VITE_SITE_URL=https://prathamukey.in npm run build
```

Set it in your hosting dashboard (build environment variable). With it set, the build adds the
canonical URL, `og:url`, absolute `og:image`/`twitter:image` and Person `url`/`image` structured
data, and emits `sitemap.xml` and a `robots.txt` that points to it. Without it none of those
absolute-URL tags are emitted. The share card is `public/og-image.jpg` (1200x630).

## Deployment

- Build command `npm run build`, output directory **`build`** (not `dist`).
- Single page: no rewrite rules needed.
- Set `VITE_SITE_URL` once the domain resolves, and redirect `www` to the bare domain (or the reverse)
  at your host so one version is canonical.

## Accessibility and performance

- Semantic landmarks, skip link, visible focus states, keyboard control of the certificate carousel
  (arrow keys, Home/End), `prefers-reduced-motion` respected everywhere (3D scene is not loaded).
- The three.js scene is loaded after first paint and skipped on reduced motion, Data Saver and
  low-power devices. Fonts are self-hosted (no third-party requests).

## Credits and licences

- Original template this repository started from: Mayank Agarwal's
  [dev-portfolio](https://github.com/mayankagarwal09/dev-portfolio), MIT (see `LICENSE.md`). All UI
  code has since been rewritten; the JSON data format is kept.
- [React](https://react.dev), [Vite](https://vite.dev), [three.js](https://threejs.org): MIT.
- Fonts: [Inter](https://rsms.me/inter/) and [JetBrains Mono](https://www.jetbrains.com/lp/mono/),
  SIL Open Font License 1.1 (licence texts in `public/fonts/`).
- Skill logos: [Simple Icons](https://simpleicons.org), CC0. The marks remain trademarks of their owners.
- Interface icons are drawn in the style of [Feather](https://feathericons.com) (MIT).
