// Avatar props: user (an object with a name, or null/undefined when there is nobody), size ("sm" or "md"),
// emptyLabel (what a missing user means, shown as the tooltip and screen reader name; default "Deleted user").
// Shows a circle with the user's initials, or "?" when the user is missing.
const sizes = {
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

const Avatar = ({ user, size = 'sm', emptyLabel = 'Deleted user' }) => {
  const label = user ? user.name : emptyLabel;
  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-50 font-medium text-indigo-700 ${sizes[size]}`}
    >
      {user ? getInitials(user.name) : '?'}
    </span>
  );
};

export default Avatar;
