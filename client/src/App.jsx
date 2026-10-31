import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AdminRoute from './routes/AdminRoute.jsx';
import GuestRoute from './routes/GuestRoute.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ProjectList from './pages/ProjectList.jsx';
import ProjectCreate from './pages/ProjectCreate.jsx';
import Board from './pages/Board.jsx';
import ProjectSettings from './pages/ProjectSettings.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Activity from './pages/Activity.jsx';
import Profile from './pages/Profile.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import NotFound from './pages/NotFound.jsx';
import ComponentDemo from './pages/ComponentDemo.jsx';

const App = () => (
  <Routes>
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
        <Route path="/" element={<Navigate to="/projects" replace />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/projects/new" element={<ProjectCreate />} />
        <Route path="/projects/:projectId" element={<Board />} />
        <Route path="/projects/:projectId/settings" element={<ProjectSettings />} />
        <Route path="/projects/:projectId/dashboard" element={<Dashboard />} />
        <Route path="/projects/:projectId/activity" element={<Activity />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin/users" element={<AdminUsers />} />
        </Route>
      </Route>
    </Route>
  </Routes>
);

export default App;
