const clamp01 = (value) => Math.min(1, Math.max(0, value));

export const engineFrequency = (progress) => 70 + 300 * clamp01(progress) ** 1.2;

/**
 * Synthesised race-engine rev: detuned saw + sub, a turbine-style whine and a little
 * air/tyre hiss, all through a limiter. Pitch follows `progress` (0-1). No audio files.
 */
export function createEngineGraph(ctx, destination) {
  const out = ctx.createGain();
  out.connect(destination);
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -14;
  limiter.knee.value = 10;
  limiter.ratio.value = 8;
  limiter.attack.value = 0.003;
  limiter.release.value = 0.15;
  limiter.connect(out);
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(limiter);

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.Q.value = 3;
  lowpass.frequency.value = 500;
  lowpass.connect(master);
  const body = ctx.createGain();
  body.gain.value = 0.5;
  body.connect(lowpass);

  const oscA = ctx.createOscillator();
  const oscB = ctx.createOscillator();
  const sub = ctx.createOscillator();
  oscA.type = 'sawtooth';
  oscB.type = 'sawtooth';
  sub.type = 'square';
  const subGain = ctx.createGain();
  subGain.gain.value = 0.22;
  oscA.connect(body);
  oscB.connect(body);
  sub.connect(subGain);
  subGain.connect(body);

  const whine = ctx.createOscillator();
  whine.type = 'sine';
  const whineGain = ctx.createGain();
  whineGain.gain.value = 0.04;
  whine.connect(whineGain);
  whineGain.connect(master);

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
  const samples = noiseBuffer.getChannelData(0);
  for (let i = 0; i < samples.length; i += 1) samples[i] = Math.random() * 2 - 1;
  const noise = ctx.createBufferSource();
  noise.buffer = noiseBuffer;
  noise.loop = true;
  const hiss = ctx.createBiquadFilter();
  hiss.type = 'bandpass';
  hiss.frequency.value = 3200;
  hiss.Q.value = 0.7;
  const hissGain = ctx.createGain();
  hissGain.gain.value = 0;
  noise.connect(hiss);
  hiss.connect(hissGain);
  hissGain.connect(master);

  let started = false;

  return {
    start(at = ctx.currentTime) {
      if (started) return;
      started = true;
      [oscA, oscB, sub, whine, noise].forEach((node) => node.start(at));
    },
    setProgress(progress, at = ctx.currentTime) {
      const p = clamp01(progress);
      const f = engineFrequency(p);
      const glide = 0.06;
      oscA.frequency.setTargetAtTime(f, at, glide);
      oscB.frequency.setTargetAtTime(f * 1.004, at, glide);
      sub.frequency.setTargetAtTime(f / 2, at, glide);
      whine.frequency.setTargetAtTime(500 + 2400 * p, at, glide);
      lowpass.frequency.setTargetAtTime(420 + 3600 * p, at, glide);
      hissGain.gain.setTargetAtTime(0.02 + 0.05 * p, at, glide);
      master.gain.setTargetAtTime(0.1 + 0.08 * p, at, glide);
    },
    tick(at = ctx.currentTime) {
      const beep = ctx.createOscillator();
      const env = ctx.createGain();
      beep.type = 'sine';
      beep.frequency.value = 880;
      env.gain.setValueAtTime(0, at);
      env.gain.linearRampToValueAtTime(0.05, at + 0.01);
      env.gain.linearRampToValueAtTime(0, at + 0.07);
      beep.connect(env);
      env.connect(out);
      beep.start(at);
      beep.stop(at + 0.09);
    },
    release(at = ctx.currentTime) {
      oscA.frequency.setTargetAtTime(60, at, 0.25);
      oscB.frequency.setTargetAtTime(60, at, 0.25);
      sub.frequency.setTargetAtTime(30, at, 0.25);
      master.gain.setTargetAtTime(0, at, 0.14);
    },
    setMuted(muted, at = ctx.currentTime) {
      out.gain.setTargetAtTime(muted ? 0 : 1, at, 0.03);
    },
    stop(at = ctx.currentTime) {
      [oscA, oscB, sub, whine, noise].forEach((node) => {
        try {
          node.stop(at);
        } catch {
          // already stopped
        }
      });
    },
  };
}
