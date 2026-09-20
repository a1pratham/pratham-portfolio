import PropTypes from 'prop-types';
import styles from './Chip.module.css';

export default function Chip({ children }) {
  return <li className={styles.chip}>{children}</li>;
}

Chip.propTypes = { children: PropTypes.node.isRequired };
