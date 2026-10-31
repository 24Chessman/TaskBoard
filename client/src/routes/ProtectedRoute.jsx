// ProtectedRoute: renders the nested routes only for a signed-in user.
// While the session is being restored it shows a Loader; otherwise it redirects to /login
// and remembers the wanted page in location state so login can return to it.
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import useAuth from '../hooks/useAuth.js';

const ProtectedRoute = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
};

export default ProtectedRoute;
