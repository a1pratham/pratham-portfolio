import { useRef } from 'react';
import PropTypes from 'prop-types';
import useMagnetic from '../../../hooks/useMagnetic';
import cx from '../../../utils/cx';
import Icon from '../Icon/Icon';
import styles from './Button.module.css';

export default function Button({
  href, variant = 'primary', size = 'md', icon, external = false, magnetic = false, ariaLabel, children, className,
}) {
  const ref = useRef(null);
  useMagnetic(ref, { enabled: magnetic });
  const externalProps = external ? { target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      className={cx(styles.button, styles[variant], styles[size], className)}
      {...externalProps}
    >
      {children}
      {icon && <Icon name={icon} size={18} />}
    </a>
  );
}

Button.propTypes = {
  href: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md']),
  icon: PropTypes.string,
  external: PropTypes.bool,
  magnetic: PropTypes.bool,
  ariaLabel: PropTypes.string,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
