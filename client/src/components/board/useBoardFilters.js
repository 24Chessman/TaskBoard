// useBoardFilters(memberIds): the board's filters, kept in the URL so Back, refresh and shared links keep them.
// Returns { filters, searchText, setSearchText, labelText, setLabelText, updateParams, clearFilters }.
// The search and label boxes keep what was typed; the URL (and so the request) follows after a short pause
// (useDebounce). Everything else (priority, assignee, due before) writes to the URL at once through updateParams.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import useDebounce from '../../hooks/useDebounce.js';
import { parseFilters } from './filters.js';

const useBoardFilters = (memberIds) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = parseFilters(searchParams, memberIds);

  const [searchText, setSearchText] = useState(filters.search);
  const [labelText, setLabelText] = useState(filters.label);
  const debouncedSearch = useDebounce(searchText);
  const debouncedLabel = useDebounce(labelText);

  const updateParams = (changes, replace = false) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
        return next;
      },
      { replace }
    );
  };

  useEffect(() => {
    if (debouncedSearch.trim() !== filters.search) updateParams({ search: debouncedSearch.trim() }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    const clean = debouncedLabel.trim().toLowerCase();
    if (clean !== filters.label) updateParams({ label: clean }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedLabel]);

  const clearFilters = () => {
    setSearchText('');
    setLabelText('');
    setSearchParams({});
  };

  return { filters, searchText, setSearchText, labelText, setLabelText, updateParams, clearFilters };
};

export default useBoardFilters;
