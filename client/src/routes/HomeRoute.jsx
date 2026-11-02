// HomeRoute: the "/" route. Guests see the public landing page; a signed-in user is sent to /projects.
// While the session is being restored it shows a Loader (like GuestRoute and ProtectedRoute), so neither the
// landing page nor a redirect flashes by mistake.
import { Navigate } from 'react-router-dom';
import Loader from '../components/Loader.jsx';
import useAuth from '../hooks/useAuth.js';
import LandingPage from '../pages/LandingPage.jsx';

const HomeRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader />;
  if (user) return <Navigate to="/projects" replace />;
  return <LandingPage />;
};

export default HomeRoute;
