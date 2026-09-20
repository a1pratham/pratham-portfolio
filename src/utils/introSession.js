const KEY = 'portfolio:intro-seen';
const BOT = /bot|crawl|spider|slurp|lighthouse/i;

/** The intro plays once per browser session, never for crawlers or deep links (#section). */
export function shouldPlayIntro() {
  if (typeof window === 'undefined') return false;
  if (BOT.test(window.navigator.userAgent) || window.location.hash) return false;
  try {
    return window.sessionStorage.getItem(KEY) !== '1';
  } catch {
    return true;
  }
}

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(KEY, '1');
  } catch {
    // storage blocked: the intro simply plays again next time
  }
}
