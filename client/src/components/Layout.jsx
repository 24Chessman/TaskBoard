// Layout (no props): the app frame used by the signed-in pages (and by NotFound for guests): top bar, sidebar and
// the page content. Signed in: a 240px sidebar from 768px up, and below that the same navigation in a left Drawer
// opened from the top bar's menu button (it closes on Esc, on overlay click and when a link is chosen).
// A guest gets the top bar (Logo and "Log in") and no sidebar.
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Drawer from './Drawer.jsx';
import { ShellProvider } from './shell/ShellContext.jsx';
import Sidebar, { SidebarNav } from './shell/Sidebar.jsx';
import TopBar from './shell/TopBar.jsx';

const Layout = () => {
  const { user } = useAuth();
  const [navOpen, setNavOpen] = useState(false);

  return (
    <ShellProvider>
      <div className="min-h-screen bg-app font-sans text-fg">
        <TopBar onOpenNavigation={user ? () => setNavOpen(true) : undefined} />
        <div className="flex">
          {user && <Sidebar />}
          <main className="min-w-0 flex-1">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
              <Outlet />
            </div>
          </main>
        </div>
        {user && (
          <Drawer isOpen={navOpen} onClose={() => setNavOpen(false)} title="Navigation" side="left" size="sm">
            <SidebarNav onNavigate={() => setNavOpen(false)} />
          </Drawer>
        )}
      </div>
    </ShellProvider>
  );
};

export default Layout;
