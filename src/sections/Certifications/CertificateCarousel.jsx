import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import PropTypes from 'prop-types';
import Icon from '../../components/ui/Icon/Icon';
import Reveal from '../../components/ui/Reveal/Reveal';
import useElementWidth from '../../hooks/useElementWidth';
import useMediaQuery from '../../hooks/useMediaQuery';
import useSwipe from '../../hooks/useSwipe';
import useWheelStep from '../../hooks/useWheelStep';
import cx from '../../utils/cx';
import CertificateCard from './CertificateCard';
import styles from './CertificateCarousel.module.css';
import { getCardStyle } from './carouselGeometry';

const pad = (value) => String(value).padStart(2, '0');

export default function CertificateCarousel({ items }) {
  const [active, setActive] = useState(0);
  const isDesktop = useMediaQuery('(min-width: 900px)');
  const mode = isDesktop ? 'arc' : 'deck';
  const regionRef = useRef(null);
  const stageRef = useRef(null);
  const stageWidth = useElementWidth(stageRef);
  const last = items.length - 1;

  const canStep = useCallback((direction) => {
    const next = active + direction;
    return next >= 0 && next <= last;
  }, [active, last]);
  const step = useCallback((direction) => {
    setActive((index) => Math.min(last, Math.max(0, index + direction)));
  }, [last]);

  useWheelStep(regionRef, { enabled: isDesktop, canStep, onStep: step });
  useSwipe(stageRef, { canStep, onSwipe: step });

  useEffect(() => {
    const region = regionRef.current;
    const onKeyDown = (event) => {
      const keys = {
        ArrowRight: () => step(1),
        ArrowLeft: () => step(-1),
        Home: () => setActive(0),
        End: () => setActive(last),
      };
      if (!keys[event.key]) return;
      event.preventDefault();
      keys[event.key]();
    };
    region.addEventListener('keydown', onKeyDown);
    return () => region.removeEventListener('keydown', onKeyDown);
  }, [step, last]);

  const current = items[active];

  return (
    <Reveal>
      <div
        ref={regionRef}
        className={styles.region}
        role="region"
        aria-roledescription="carousel"
        aria-label="Certifications"
      >
        <div ref={stageRef} className={cx(styles.stage, styles[mode])}>
          {items.map((certificate, index) => {
            const offset = index - active;
            const isActive = offset === 0;
            return (
              <div
                key={certificate.id}
                className={styles.slot}
                style={getCardStyle(mode, offset, stageWidth)}
                data-active={isActive}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${items.length}`}
                aria-hidden={isActive ? undefined : true}
              >
                <CertificateCard certificate={certificate} interactive={isActive} />
                {!isActive && (
                  <button
                    type="button"
                    className={styles.hit}
                    tabIndex={-1}
                    aria-label={`Show ${certificate.title}`}
                    onClick={() => setActive(index)}
                  />
                )}
              </div>
            );
          })}
        </div>

        <div className={styles.controls}>
          <button
            type="button"
            className={cx(styles.arrow, styles.prev)}
            onClick={() => step(-1)}
            disabled={active === 0}
            aria-label="Previous certificate"
          >
            <Icon name="chevron" size={18} />
          </button>

          <div className={styles.progress}>
            <p className={styles.counter} aria-hidden="true">
              {pad(active + 1)}
              {' / '}
              {pad(items.length)}
            </p>
            <div className={styles.dots}>
              {items.map((certificate, index) => (
                <button
                  key={certificate.id}
                  type="button"
                  className={styles.dot}
                  aria-label={`Go to certificate ${index + 1}: ${certificate.title}`}
                  aria-current={index === active ? 'true' : undefined}
                  onClick={() => setActive(index)}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            className={cx(styles.arrow, styles.next)}
            onClick={() => step(1)}
            disabled={active === last}
            aria-label="Next certificate"
          >
            <Icon name="chevron" size={18} />
          </button>
        </div>

        <p className={styles.hint} aria-hidden="true">
          {isDesktop ? 'Scroll, click a card or use the arrow keys' : 'Swipe to browse'}
        </p>
        <p className="visually-hidden" aria-live="polite">
          {`Certificate ${active + 1} of ${items.length}: ${current.title}`}
        </p>
      </div>
    </Reveal>
  );
}

CertificateCarousel.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  })).isRequired,
};
