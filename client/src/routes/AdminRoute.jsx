// AdminRoute: renders the nested routes only for an admin; any other user sees the Forbidden page.
// Put it inside ProtectedRoute so the user is already signed in.
import { Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth.js';
import Forbidden from '../pages/Forbidden.jsx';

const AdminRoute = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <Outlet /> : <Forbidden />;
};

export default AdminRoute;
