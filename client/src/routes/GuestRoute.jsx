// GuestRoute: for /login and /register. A signed-in user is sent to /projects instead.
import { Navigate, Outlet } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import useAuth from '../hooks/useAuth.js';

const GuestRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (user) return <Navigate to="/projects" replace />;
  return <Outlet />;
};

export default GuestRoute;
