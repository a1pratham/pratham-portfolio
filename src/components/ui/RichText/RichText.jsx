import PropTypes from 'prop-types';
import { parseInline } from '../../../utils/text';

/** Renders text containing **bold** segments without dangerouslySetInnerHTML. */
export default function RichText({ text, as: Tag = 'p', className }) {
  return (
    <Tag className={className}>
      {parseInline(text).map(({ text: part, bold }) => (
        bold ? <strong key={part}>{part}</strong> : part
      ))}
    </Tag>
  );
}

RichText.propTypes = {
  text: PropTypes.string.isRequired,
  as: PropTypes.elementType,
  className: PropTypes.string,
};
