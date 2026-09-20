import PropTypes from 'prop-types';
import useCopyToClipboard from '../../hooks/useCopyToClipboard';
import cx from '../../utils/cx';
import styles from './CopyEmailButton.module.css';

const MESSAGES = { idle: '', copied: 'Email address copied', failed: 'Could not copy. Select the address instead.' };

export default function CopyEmailButton({ email }) {
  const { status, copy } = useCopyToClipboard();

  return (
    <>
      <button
        type="button"
        className={cx(styles.button, status === 'copied' && styles.copied)}
        onClick={() => copy(email)}
        aria-label={`Copy email address ${email}`}
      >
        <span className={styles.address}>{email}</span>
        <span className={styles.state} aria-hidden="true">
          {status === 'copied' ? 'Copied' : 'Copy'}
        </span>
      </button>
      <span className="visually-hidden" role="status">{MESSAGES[status]}</span>
    </>
  );
}

CopyEmailButton.propTypes = { email: PropTypes.string.isRequired };
