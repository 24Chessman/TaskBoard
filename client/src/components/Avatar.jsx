// Avatar props: user (an object with a name, or null/undefined when there is nobody), size ("xs", "sm" or "md",
// default "sm"), emptyLabel (what a missing user means, used as the tooltip and screen reader name; default
// "Deleted user"), className (extra classes, for example a ring when avatars overlap).
// A circle with the user's initials on a soft colour that depends on the name (always the same for the same name),
// or a neutral "?" when the user is missing. The initials are drawn with CSS (data-initials), not as text, so a button
// that wraps an avatar is named only by its aria-label (WCAG 2.5.3 Label in Name).
import { colorForName } from '../utils/nameColors.js';

const sizes = {
  xs: 'h-5 w-5 text-[10px]',
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
};

// "Ada Lovelace" -> "AL", "Ada" -> "A", "" -> "?"
export const getInitials = (name) => {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
};

const Avatar = ({ user, size = 'sm', emptyLabel = 'Deleted user', className = '' }) => {
  const label = user ? user.name : emptyLabel;
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      data-initials={user ? getInitials(user.name) : '?'}
      className={`inline-flex shrink-0 select-none before:content-[attr(data-initials)] items-center justify-center rounded-full font-medium ${sizes[size] || sizes.sm} ${colorForName(user?.name)} ${className}`} // unslop-ignore: avatars are full circles by design (docs/design.md section 5)
    />
  );
};

export default Avatar;
