import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
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

const App = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />

    <Route element={<Layout />}>
      <Route path="/" element={<Navigate to="/projects" replace />} />
      <Route path="/projects" element={<ProjectList />} />
      <Route path="/projects/new" element={<ProjectCreate />} />
      <Route path="/projects/:projectId" element={<Board />} />
      <Route path="/projects/:projectId/settings" element={<ProjectSettings />} />
      <Route path="/projects/:projectId/dashboard" element={<Dashboard />} />
      <Route path="/projects/:projectId/activity" element={<Activity />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);

export default App;
