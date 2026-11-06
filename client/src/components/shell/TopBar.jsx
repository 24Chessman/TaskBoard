// TopBar props: onOpenNavigation (optional: when given, a hamburger button is shown below 768px that opens the
// sidebar drawer). The h-14 bar at the top of every app page: Logo (links to /projects when signed in), and on the
// right the user menu, an avatar button that opens a menu with the user's name, email and role, "Profile" and
// "Log out". There is no name or "Profile" text in the bar itself. A guest (for example on the NotFound page)
// sees the Logo (links to "/") and a "Log in" link instead of the menu.
import { LogOut, Menu, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Avatar from '../Avatar.jsx';
import Badge from '../Badge.jsx';
import Dropdown from '../Dropdown.jsx';
import IconButton from '../IconButton.jsx';
import Logo from '../Logo.jsx';

const ring = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2';

const TopBar = ({ onOpenNavigation }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { label: 'Profile', icon: User, onSelect: () => navigate('/profile') },
    { type: 'separator' },
    { label: 'Log out', icon: LogOut, onSelect: handleLogout },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-line bg-surface px-4 sm:px-6">
      <div className="flex items-center gap-2">
        {onOpenNavigation && (
          <IconButton icon={Menu} label="Open navigation" className="md:hidden" onClick={onOpenNavigation} />
        )}
        <Link
          to={user ? '/projects' : '/'}
          aria-label={user ? 'TaskBoard, go to projects' : 'TaskBoard home'}
          className={`inline-flex min-h-10 items-center rounded-md ${ring}`}
        >
          <Logo />
        </Link>
      </div>

      {user ? (
        <Dropdown
          label="Open user menu"
          triggerContent={<Avatar user={user} size="md" />}
          triggerClassName="rounded-full max-sm:p-1" // unslop-ignore: the trigger wraps a circular avatar, so its focus ring is a circle
          items={menuItems}
          header={
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-fg">{user.name}</p>
              <p className="truncate text-xs text-fg-secondary">{user.email}</p>
              <Badge variant={user.role === 'admin' ? 'primary' : 'neutral'} className="mt-1">
                {user.role === 'admin' ? 'Admin' : 'User'}
              </Badge>
            </div>
          }
        />
      ) : (
        <Link
          to="/login"
          className={`rounded-md px-3 py-2 text-sm font-medium text-fg-secondary hover:bg-surface-muted hover:text-fg ${ring}`}
        >
          Log in
        </Link>
      )}
    </header>
  );
};

export default TopBar;
