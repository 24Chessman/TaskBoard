// useDebounce(value, delay = 300): returns value, but only after it has stopped changing for delay milliseconds.
// Use it on a search box so a request is not sent on every keystroke.
import { useEffect, useState } from 'react';

const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebounce;
