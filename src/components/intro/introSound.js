import { createEngineGraph } from './engineGraph';

export const isSoundSupported = () => typeof window !== 'undefined'
  && Boolean(window.AudioContext || window.webkitAudioContext);

/**
 * Browsers only allow audio after a user gesture, so nothing is created until
 * `enable()` is called from a click/tap/keypress handler.
 */
export default function createIntroSound() {
  let ctx = null;
  let graph = null;
  let enabled = false;

  return {
    async enable(progress = 0) {
      if (!isSoundSupported()) return false;
      try {
        if (!ctx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          ctx = new AudioContextClass();
          graph = createEngineGraph(ctx, ctx.destination);
          graph.start();
        }
        await ctx.resume();
        if (ctx.state !== 'running') return false;
        enabled = true;
        graph.setMuted(false);
        graph.setProgress(progress);
        return true;
      } catch {
        return false;
      }
    },
    mute() {
      enabled = false;
      graph?.setMuted(true);
    },
    setProgress(progress) {
      if (enabled) graph.setProgress(progress);
    },
    tick() {
      if (enabled) graph.tick();
    },
    release() {
      if (enabled) graph.release();
    },
    dispose() {
      enabled = false;
      try {
        graph?.stop(ctx.currentTime + 0.4);
        setTimeout(() => ctx?.close(), 600);
      } catch {
        // context already closed
      }
    },
  };
}
