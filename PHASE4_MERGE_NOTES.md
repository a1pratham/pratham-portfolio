# Phase 4 - Certifications carousel (merge notes)

Only files needed for this phase are included; paths mirror the project root.

## New files
- `src/data/certificateAssets.js`  - THE place to add real certificate images/PDFs
- `src/data/certificates.js`       - certifications.json + assets, normalised for the UI
- `src/hooks/useElementWidth.js`, `useWheelStep.js`, `useSwipe.js` (+ `useWheelStep.test.js`)
- `src/sections/Certifications/`   - Certifications, CertificateCarousel, CertificateCard,
                                     carouselGeometry (+ tests)
- `public/certificates/.gitkeep`   - drop certificate files here

## Modified file (2 additions only)
- `src/sections/index.js`: add `import Certifications from './Certifications/Certifications';`
  and the `{ id: 'certifications', label: 'Certifications', Component: Certifications, inNav: true }`
  entry after Skills.

## Relies on existing pieces from earlier phases (not included)
`components/layout/Section`, `components/ui/{Reveal,RichText,Icon}` (Icon needs the `chevron`
glyph added in Phase 3), `hooks/useMediaQuery`, `data/certifications.json`, `utils/text.slugify`,
and the global tokens/`.visually-hidden` class.

## Adding real certificates
1. Put files in `public/certificates/`.
2. In `src/data/certificateAssets.js` set, per certificate id:
   `{ image: '/certificates/x.webp', file: '/certificates/x.pdf' }`
   `image` = preview on the card, `file` = what "View Certificate" opens (falls back to `image`).
   Until a file is set, the card shows a placeholder and a disabled button.

## Behaviour summary
- >= 900px: curved arc, wheel/trackpad rotates one card per gesture (only while the carousel is
  near the middle of the viewport; page scrolling resumes at the first/last card), click a side
  card, arrow keys/Home/End, dots, prev/next, touch swipe on touch laptops/tablets.
- < 900px: swipeable stacked deck (touch swipe, tap a peeking card, buttons, keys).
- `prefers-reduced-motion`: transitions collapse to ~0 via the global rule in `styles/base.css`.
