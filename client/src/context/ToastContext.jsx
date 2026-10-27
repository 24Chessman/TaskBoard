// ToastProvider props: children. Wrap the app once; call useToast().showToast(message, type)
// from any component, where type is "success" or "error". Toasts auto-dismiss after 4 seconds.
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import Toast from '../components/Toast.jsx';

const DISMISS_MS = 4000;

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);
  const timers = useRef(new Map());

  const removeToast = useCallback((id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'success') => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, type }]);
      timers.current.set(id, setTimeout(() => removeToast(id), DISMISS_MS));
    },
    [removeToast]
  );

  useEffect(() => {
    const activeTimers = timers.current;
    return () => activeTimers.forEach(clearTimeout);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider');
  return context;
};
