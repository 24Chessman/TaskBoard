// Navbar (no props). Sticky header: logo to /projects, Projects link, an Admin link for admins only,
// and (when signed in) a user menu with the user's name, a Profile link and Logout.
// Below the sm breakpoint everything moves into a menu opened by a toggle button.
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
    isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100'
  }`;

const itemClass =
  'block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 active:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const closeMenus = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleLogout = () => {
    closeMenus();
    logout();
    navigate('/login');
  };

  const navItems = [{ to: '/projects', label: 'Projects' }];
  if (user?.role === 'admin') navItems.push({ to: '/admin/users', label: 'Admin' });

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/projects" className="text-xl font-bold text-slate-900">
          TaskBoard
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}

          {user && (
            <div className="relative ml-2">
              <button
                type="button"
                className={`${linkClass({ isActive: false })} border border-slate-200`}
                aria-expanded={userMenuOpen}
                aria-haspopup="true"
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                {user.name}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
                  <Link to="/profile" className={itemClass} onClick={closeMenus}>
                    Profile
                  </Link>
                  <button type="button" className={itemClass} onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </div>

      {menuOpen && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="flex flex-col gap-1 border-t border-slate-200 px-4 py-2 sm:hidden"
        >
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass} onClick={closeMenus}>
              {item.label}
            </NavLink>
          ))}
          {user && (
            <>
              <p className="px-3 pt-2 text-xs text-slate-500">Signed in as {user.name}</p>
              <NavLink to="/profile" className={linkClass} onClick={closeMenus}>
                Profile
              </NavLink>
              <button type="button" className={itemClass} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
};

export default Navbar;
