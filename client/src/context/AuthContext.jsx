// AuthProvider props: children. Holds { user, token, loading } and exposes
// login(email, password), register(name, email, password) and logout().
// The token lives in localStorage ("taskboard_token"); on load it is used to restore the user via GET /auth/me.
import { createContext, useEffect, useState } from 'react';
import axiosClient, { clearToken, getToken, setToken } from '../api/axiosClient.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(getToken);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!token) return undefined;
    let cancelled = false;

    axiosClient
      .get('/auth/me')
      .then((response) => {
        if (!cancelled) setUser(response.data.data);
      })
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setTokenState(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // Only restore once on load; login/register set the user directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveSession = ({ token: newToken, user: newUser }) => {
    setToken(newToken);
    setTokenState(newToken);
    setUser(newUser);
  };

  // login and register throw on failure so the page can show the server's errors
  const login = async (email, password) => {
    const response = await axiosClient.post('/auth/login', { email, password });
    saveSession(response.data.data);
  };

  const register = async (name, email, password) => {
    const response = await axiosClient.post('/auth/register', { name, email, password });
    saveSession(response.data.data);
  };

  const logout = () => {
    clearToken();
    setTokenState(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
