import PropTypes from 'prop-types';
import cx from '../../utils/cx';
import styles from './StartLights.module.css';

const COUNT = 5;

/** Five start lights: they come on one by one with the progress, then all go out. */
export default function StartLights({ lit, out = false }) {
  return (
    <div className={styles.lights} aria-hidden="true">
      {Array.from({ length: COUNT }, (_, index) => (
        <span key={index} className={cx(styles.light, !out && index < lit && styles.on)} />
      ))}
    </div>
  );
}

StartLights.propTypes = { lit: PropTypes.number.isRequired, out: PropTypes.bool };
