// Avatar props: user (an object with a name, or null/undefined when there is nobody), size ("xs", "sm" or "md",
// default "sm"), emptyLabel (what a missing user means, used as the tooltip and screen reader name; default
// "Deleted user"), className (extra classes, for example a ring when avatars overlap).
// A circle with the user's initials on a soft colour that depends on the name (always the same for the same name),
// or a neutral "?" when the user is missing.
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
      className={`inline-flex shrink-0 select-none items-center justify-center rounded-full font-medium ${sizes[size] || sizes.sm} ${colorForName(user?.name)} ${className}`}
    >
      {user ? getInitials(user.name) : '?'}
    </span>
  );
};

export default Avatar;
