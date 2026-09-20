import PropTypes from 'prop-types';
import styles from './IntroProgress.module.css';

function Chequered() {
  return (
    <svg className={styles.flag} width="18" height="12" viewBox="0 0 18 12" aria-hidden="true" focusable="false">
      {Array.from({ length: 12 }, (_, index) => {
        const col = index % 6;
        const row = Math.floor(index / 6);
        return (col + row) % 2 === 0
          ? <rect key={index} x={col * 3} y={row * 6} width="3" height="6" fill="currentColor" />
          : null;
      })}
    </svg>
  );
}

/** Main loading bar, START to FINISH. Width follows the --progress CSS variable. */
export default function IntroProgress({ percent }) {
  return (
    <div className={styles.progress}>
      <div className={styles.meta}>
        <span>Loading</span>
        <span className={styles.percent}>{`${percent}%`}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-label="Loading portfolio"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <div className={styles.fill} />
      </div>
      <div className={styles.ends}>
        <span>Start</span>
        <span className={styles.finish}>
          Finish
          <Chequered />
        </span>
      </div>
    </div>
  );
}

IntroProgress.propTypes = { percent: PropTypes.number.isRequired };
