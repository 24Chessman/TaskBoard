import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Loader from './components/Loader.jsx';
import ProjectLayout from './components/ProjectLayout.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import GuestRoute from './routes/GuestRoute.jsx';
import HomeRoute from './routes/HomeRoute.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProjectList from './pages/ProjectList.jsx';
import ProjectCreate from './pages/ProjectCreate.jsx';
import Board from './pages/Board.jsx';
import ProjectSettings from './pages/ProjectSettings.jsx';
import Activity from './pages/Activity.jsx';
import Profile from './pages/Profile.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import NotFound from './pages/NotFound.jsx';
import ComponentDemo from './pages/ComponentDemo.jsx';

// The dashboard (and its chart library) loads only when the page is opened
const Dashboard = lazy(() => import('./pages/Dashboard.jsx'));

const App = () => (
  <Routes>
    {/* The public home: the landing page for guests, a redirect to /projects for signed-in users */}
    <Route path="/" element={<HomeRoute />} />

    <Route element={<GuestRoute />}>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Route>

    {/* Public pages inside the layout: the dev demo (dev only) and NotFound */}
    <Route element={<Layout />}>
      {import.meta.env.DEV && <Route path="/dev/components" element={<ComponentDemo />} />}
      <Route path="*" element={<NotFound />} />
    </Route>

    <Route element={<ProtectedRoute />}>
      <Route element={<Layout />}>
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectCreate />} />
        <Route path="/projects/:projectId" element={<ProjectLayout />}>
          <Route index element={<Board />} />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<Loader label="Loading dashboard" />}>
                <Dashboard />
              </Suspense>
            }
          />
          <Route path="activity" element={<Activity />} />
          <Route path="settings" element={<ProjectSettings />} />
        </Route>
        <Route path="/profile" element={<Profile />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Route>
  </Routes>
);

export default App;
