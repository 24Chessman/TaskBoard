// Layout (no props): the app frame used by the signed-in pages (and by NotFound for guests). The top bar and the
// page content. The sidebar is added in the next commit.
import { Outlet } from 'react-router-dom';
import TopBar from './shell/TopBar.jsx';

const Layout = () => (
  <div className="min-h-screen bg-app font-sans text-fg">
    <TopBar />
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Outlet />
    </main>
  </div>
);

export default Layout;
