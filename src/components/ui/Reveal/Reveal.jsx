import { useRef } from 'react';
import PropTypes from 'prop-types';
import useInView from '../../../hooks/useInView';
import useReducedMotion from '../../../hooks/useReducedMotion';
import cx from '../../../utils/cx';
import styles from './Reveal.module.css';

export default function Reveal({
  as: Tag = 'div', delay = 0, className, children, ...rest
}) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const reducedMotion = useReducedMotion();

  return (
    <Tag
      ref={ref}
      data-reveal=""
      data-visible={inView || reducedMotion}
      className={cx(styles.reveal, className)}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

Reveal.propTypes = {
  as: PropTypes.elementType,
  delay: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};
