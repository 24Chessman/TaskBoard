// Pure helpers for the board filters that live in the URL query string (?search=&priority=&assignee=&label=&dueBefore=).
// Invalid values (an unknown priority, an assignee who is not a member, a malformed date) are ignored, as before.
export const PRIORITIES = ['low', 'medium', 'high'];
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// parseFilters(searchParams, memberIds) -> { search, label, priority, assignee, dueBefore } (strings, '' when unset)
export const parseFilters = (searchParams, memberIds) => {
  const priority = searchParams.get('priority');
  const assignee = searchParams.get('assignee');
  const dueBefore = searchParams.get('dueBefore') || '';
  return {
    search: searchParams.get('search') || '',
    label: searchParams.get('label') || '',
    priority: PRIORITIES.includes(priority) ? priority : '',
    assignee: memberIds.includes(assignee) ? assignee : '',
    dueBefore: DATE_PATTERN.test(dueBefore) ? dueBefore : '',
  };
};

// How many of the filters inside the Filters popover are active (priority, label, due before). Search and the
// assignee toggles sit outside the popover, so they are not counted in its badge.
export const activeFilterCount = (filters) => [filters.priority, filters.label, filters.dueBefore].filter(Boolean).length;

// True when anything at all narrows the board (shows the Clear button and the "no tasks match" message)
export const hasActiveFilters = (filters) => Boolean(filters.search || filters.assignee) || activeFilterCount(filters) > 0;

// The query string for a set of filters: only the ones that are set
export const filtersToParams = (filters) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => value && params.set(key, value));
  return params;
};
