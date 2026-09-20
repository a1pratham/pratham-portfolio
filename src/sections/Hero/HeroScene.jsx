import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { hasFinePointer } from '../../utils/capabilities';
import styles from './HeroScene.module.css';

const clamp01 = (value) => Math.min(1, Math.max(0, value));

/** Lazy-loads three.js after first paint and drives the scene from DOM events. */
export default function HeroScene({ onReady }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    let controller = null;
    const teardown = [];

    const start = async () => {
      let createHeroScene;
      try {
        ({ default: createHeroScene } = await import('./scene/createHeroScene'));
        if (cancelled) return;
        const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4;
        controller = createHeroScene(canvasRef.current, { lowPower });
      } catch {
        return; // no WebGL: the CSS fallback stays in place
      }

      const wrapper = wrapperRef.current;
      let inView = true;
      let pageVisible = !document.hidden;
      const sync = () => controller.setActive(inView && pageVisible);

      const resizeObserver = new ResizeObserver(([entry]) => {
        controller.resize(entry.contentRect.width, entry.contentRect.height);
      });
      resizeObserver.observe(wrapper);

      const intersectionObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        sync();
      });
      intersectionObserver.observe(wrapper);

      const onVisibility = () => {
        pageVisible = !document.hidden;
        sync();
      };
      document.addEventListener('visibilitychange', onVisibility);

      const onPointerMove = (event) => {
        controller.setPointer(
          (event.clientX / window.innerWidth) * 2 - 1,
          (event.clientY / window.innerHeight) * 2 - 1,
        );
      };
      if (hasFinePointer()) window.addEventListener('pointermove', onPointerMove, { passive: true });

      let scrollFrame = 0;
      const onScroll = () => {
        if (scrollFrame) return;
        scrollFrame = requestAnimationFrame(() => {
          scrollFrame = 0;
          const progress = clamp01(window.scrollY / wrapper.offsetHeight);
          controller.setScroll(progress);
          wrapper.style.setProperty('--scene-fade', String(clamp01(1 - progress * 1.2)));
        });
      };
      window.addEventListener('scroll', onScroll, { passive: true });

      teardown.push(() => {
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('scroll', onScroll);
        cancelAnimationFrame(scrollFrame);
      });

      sync();
      onReady();
    };

    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(start, { timeout: 1500 })
      : window.setTimeout(start, 250);

    return () => {
      cancelled = true;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      teardown.forEach((fn) => fn());
      controller?.dispose();
    };
  }, [onReady]);

  return (
    <div ref={wrapperRef} className={styles.wrapper} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  );
}

HeroScene.propTypes = { onReady: PropTypes.func.isRequired };
