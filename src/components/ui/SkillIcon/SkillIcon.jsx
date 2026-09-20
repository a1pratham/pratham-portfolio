import PropTypes from 'prop-types';
import skillIcons from '../../../data/skillIcons';

export default function SkillIcon({ name, size = 28 }) {
  const path = skillIcons[name];
  if (!path) return null;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
      <path d={path} />
    </svg>
  );
}

SkillIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number,
};
