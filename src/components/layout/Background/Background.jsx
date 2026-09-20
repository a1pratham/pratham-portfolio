import styles from './Background.module.css';

export default function Background() {
  return (
    <div className={styles.background} aria-hidden="true">
      <div className={styles.glowA} />
      <div className={styles.glowB} />
      <div className={styles.grid} />
      <div className={styles.grain} />
    </div>
  );
}
