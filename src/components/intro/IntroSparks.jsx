import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './IntroSparks.module.css';

const GRAVITY = 1100;
const RAMP_S = 0.9;
const MAX_SPARKS = 320;
const MAX_SMOKE = 40;

const rand = (min, max) => min + Math.random() * (max - min);

function tokenRgb(name, fallback) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
  return value.split(/\s+/).map(Number);
}

/**
 * Sparks and tyre smoke thrown off the bottom of the wheel. Canvas 2D, capped particle counts,
 * stops as soon as it unmounts. Emission ramps up with the wheel's spin-up.
 */
export default function IntroSparks({ originRef, active }) {
  const canvasRef = useRef(null);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return undefined;

    const palette = [
      tokenRgb('--accent-rgb', '255 111 97'),
      tokenRgb('--accent-2-rgb', '255 184 107'),
      [255, 244, 230],
    ];
    const sparks = [];
    const smoke = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = performance.now();
    const start = last;
    let sparkDebt = 0;
    let smokeDebt = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const origin = () => {
      const rect = originRef.current?.getBoundingClientRect();
      if (!rect) return { x: width / 2, y: height / 2, r: 120 };
      return { x: rect.left + rect.width * 0.46, y: rect.top + rect.height * 0.965, r: rect.width / 2 };
    };

    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const intensity = activeRef.current ? Math.min(1, (now - start) / 1000 / RAMP_S) : 0;
      const o = origin();

      sparkDebt += 190 * intensity * dt;
      while (sparkDebt >= 1 && sparks.length < MAX_SPARKS) {
        sparkDebt -= 1;
        const speed = rand(380, 1000);
        const spread = rand(-0.5, 0.35);
        sparks.push({
          x: o.x + rand(-o.r * 0.25, o.r * 0.1),
          y: o.y,
          vx: -speed * Math.cos(spread),
          vy: -speed * Math.sin(spread) * 0.55 - rand(0, 140),
          life: rand(0.3, 0.85),
          age: 0,
          color: palette[Math.floor(Math.random() * palette.length)],
          size: rand(1.5, 3.2),
        });
      }
      smokeDebt += 22 * intensity * dt;
      while (smokeDebt >= 1 && smoke.length < MAX_SMOKE) {
        smokeDebt -= 1;
        smoke.push({
          x: o.x + rand(-o.r * 0.3, o.r * 0.1),
          y: o.y - rand(0, 10),
          vx: -rand(40, 130),
          vy: -rand(20, 80),
          life: rand(0.8, 1.5),
          age: 0,
          radius: rand(14, 26),
        });
      }

      context.clearRect(0, 0, width, height);
      context.globalCompositeOperation = 'source-over';
      for (let i = smoke.length - 1; i >= 0; i -= 1) {
        const puff = smoke[i];
        puff.age += dt;
        if (puff.age >= puff.life) {
          smoke.splice(i, 1);
        } else {
          puff.x += puff.vx * dt;
          puff.y += puff.vy * dt;
          const k = puff.age / puff.life;
          const radius = puff.radius + k * 70;
          const gradient = context.createRadialGradient(puff.x, puff.y, 0, puff.x, puff.y, radius);
          gradient.addColorStop(0, `rgba(200, 192, 186, ${(0.24 * (1 - k)).toFixed(3)})`);
          gradient.addColorStop(1, 'rgba(200, 192, 186, 0)');
          context.fillStyle = gradient;
          context.beginPath();
          context.arc(puff.x, puff.y, radius, 0, Math.PI * 2);
          context.fill();
        }
      }

      context.globalCompositeOperation = 'lighter';
      context.lineCap = 'round';
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const spark = sparks[i];
        spark.age += dt;
        if (spark.age >= spark.life) {
          sparks.splice(i, 1);
        } else {
          spark.vy += GRAVITY * dt;
          spark.x += spark.vx * dt;
          spark.y += spark.vy * dt;
          const alpha = 1 - spark.age / spark.life;
          const [r, g, b] = spark.color;
          context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(3)})`;
          context.lineWidth = spark.size;
          context.beginPath();
          context.moveTo(spark.x - spark.vx * 0.028, spark.y - spark.vy * 0.028);
          context.lineTo(spark.x, spark.y);
          context.stroke();
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [originRef]);

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />;
}

IntroSparks.propTypes = {
  originRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  active: PropTypes.bool.isRequired,
};
