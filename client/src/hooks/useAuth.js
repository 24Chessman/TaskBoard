// useAuth: returns { user, token, loading, login, register, logout } from AuthProvider.
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
};

export default useAuth;
