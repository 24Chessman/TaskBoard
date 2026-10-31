// useFetch(fetcher, deps): runs fetcher() (a function that returns a promise) on mount and whenever deps change.
// Returns { data, loading, error, status, refetch }:
//   data     the result, or null while loading or after an error
//   loading  true while a request is running
//   error    the API's error message when there is one, otherwise the error's own message ('' when fine)
//   status   HTTP status of the failed request (e.g. 403, 404) or null, so a screen can react to it
//   refetch  runs the request again. The old data stays on screen meanwhile, so a parent layout does not unmount.
// Results of requests that were replaced by a newer one are ignored. fetcher is not a dependency on purpose,
// so callers can pass an inline arrow function.
import { useCallback, useEffect, useRef, useState } from 'react';

const useFetch = (fetcher, deps = []) => {
  const [state, setState] = useState({ data: null, loading: true, error: '', status: null });
  const [tick, setTick] = useState(0);
  const keepData = useRef(false);

  useEffect(() => {
    let ignore = false;
    const keep = keepData.current;
    keepData.current = false;

    setState((current) => ({ data: keep ? current.data : null, loading: true, error: '', status: null }));

    fetcher()
      .then((data) => {
        if (!ignore) setState({ data, loading: false, error: '', status: null });
      })
      .catch((error) => {
        if (ignore) return;
        setState({
          data: null,
          loading: false,
          error: error.response?.data?.message || error.message || 'Something went wrong',
          status: error.response?.status ?? null,
        });
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const refetch = useCallback(() => {
    keepData.current = true;
    setTick((current) => current + 1);
  }, []);

  return { ...state, refetch };
};

export default useFetch;
