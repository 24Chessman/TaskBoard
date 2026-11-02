// AvatarGroup props: users (array of user objects; null entries show as a missing user), max (how many avatars to
// show before "+n", default 4), size ("xs" | "sm" | "md", default "sm"), label (accessible name of the group,
// default "N people"), className. Overlapping avatars with a white ring; the "+n" circle names the hidden people.
import Avatar from './Avatar.jsx';

const overflowSizes = {
  xs: 'h-5 w-5 text-[10px]',
  sm: 'h-6 w-6 text-xs',
  md: 'h-8 w-8 text-sm',
};

const AvatarGroup = ({ users = [], max = 4, size = 'sm', label, className = '' }) => {
  const visible = users.slice(0, max);
  const hidden = users.slice(max);
  const hiddenNames = hidden.map((user) => (user ? user.name : 'Deleted user')).join(', ');

  return (
    <div
      role="group"
      aria-label={label || `${users.length} ${users.length === 1 ? 'person' : 'people'}`}
      className={`flex items-center -space-x-2 ${className}`}
    >
      {visible.map((user, index) => (
        <Avatar key={user?._id || `missing-${index}`} user={user} size={size} className="ring-2 ring-surface" />
      ))}
      {hidden.length > 0 && (
        <span
          role="img"
          aria-label={`and ${hidden.length} more: ${hiddenNames}`}
          title={hiddenNames}
          className={`inline-flex shrink-0 items-center justify-center rounded-full bg-surface-muted font-medium text-fg-secondary ring-2 ring-surface ${overflowSizes[size] || overflowSizes.sm}`}
        >
          +{hidden.length}
        </span>
      )}
    </div>
  );
};

export default AvatarGroup;
