# F1 intro animation - merge notes

Paths mirror the project root. Only new/changed files are included. Nothing to delete.

## New
- `src/components/intro/` - Intro (orchestrator), IntroWheel, IntroSparks, IntroCircuit, StartLights,
  IntroProgress, `introSound.js` + `engineGraph.js` (synthesised engine, no audio files), CSS modules, tests
- `src/hooks/useIntroProgress.js` (+ test) - progress that waits for fonts + page load
- `src/utils/introSession.js` (+ test) - once per session; skips deep links and crawlers

## Changed
- `src/App.jsx` - mounts `<Intro />` first (one import + one line)
- `src/setupTests.js` - marks the intro as seen so other tests are unaffected
- `README.md` - "Intro animation" section

## Behaviour
- Plays once per session (~3.3 s), Skip button / Esc, focus stays inside the intro.
- Site entrance (scroll-reveal) animations are held until the intro slides away.
- Reduced motion: static frame ~1 s, no canvas, no sound. No flashing: fast-spin detail fades out,
  only low-contrast soft streaks rotate; lights turn on one by one, then off once.
- Sound: opt-in button (browsers block autoplay). Colours come from the CSS palette tokens.
