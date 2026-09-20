const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const round = (value) => Math.round(value * 10) / 10;

export const ARC_STEP_DEG = 30;
export const ARC_VISIBLE = 3;
export const DECK_VISIBLE = 2;

/** Front card follows the finger while swiping (--drag is set by useSwipe). */
const dragPrefix = (offset) => (offset === 0 ? 'translateX(var(--drag, 0px)) ' : '');

/** Card positioned on a curved arc: depth, tilt, scale, blur and fade grow with distance. */
export function getArcStyle(offset, stageWidth = 1200) {
  const distance = Math.abs(offset);
  const radius = clamp(stageWidth * 0.6, 360, 900);
  const angle = (offset * ARC_STEP_DEG * Math.PI) / 180;
  const x = Math.sin(angle) * radius;
  const z = -(1 - Math.cos(angle)) * radius;
  const y = (1 - Math.cos(angle)) * radius * 0.05;
  const tilt = -offset * ARC_STEP_DEG * 0.75;
  const scale = offset === 0 ? 1.1 : 1 - distance * 0.05;
  const visible = distance <= ARC_VISIBLE;

  return {
    transform: `${dragPrefix(offset)}translate3d(${round(x)}px, ${round(y)}px, ${round(z)}px) rotateY(${round(tilt)}deg) scale(${scale})`,
    opacity: visible ? [1, 0.8, 0.5, 0.2][distance] : 0,
    filter: offset === 0 ? 'none' : `blur(${round(distance * 1.4)}px) brightness(${round(1 - distance * 0.15)})`,
    zIndex: 20 - distance,
    pointerEvents: distance <= ARC_VISIBLE - 1 ? 'auto' : 'none',
    visibility: visible ? 'visible' : 'hidden',
  };
}

/** Mobile deck: neighbours peek out from behind the front card. */
export function getDeckStyle(offset) {
  const distance = Math.abs(offset);
  const visible = distance <= DECK_VISIBLE;

  return {
    transform: `${dragPrefix(offset)}translate3d(${offset * 16}%, ${distance * 12}px, ${-distance * 40}px) rotate(${offset * 3}deg) scale(${round(1 - distance * 0.07)})`,
    opacity: visible ? [1, 0.9, 0.55][distance] : 0,
    filter: offset === 0 ? 'none' : `brightness(${round(1 - distance * 0.25)})`,
    zIndex: 20 - distance,
    pointerEvents: visible ? 'auto' : 'none',
    visibility: visible ? 'visible' : 'hidden',
  };
}

export const getCardStyle = (mode, offset, stageWidth) => (
  mode === 'arc' ? getArcStyle(offset, stageWidth) : getDeckStyle(offset)
);
