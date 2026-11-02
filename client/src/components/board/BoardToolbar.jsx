// BoardToolbar props: members (project members with a user), filters (from useBoardFilters), searchText,
// onSearchText, labelText, onLabelText, onChange(changes) (writes priority, assignee or dueBefore to the URL),
// onClear, onRefresh, refreshing (true while a request is running; the refresh icon then spins, unless the user
// prefers reduced motion). One compact row: search, assignee toggle avatars, a Filters button (with the count of
// active popover filters) that opens a Popover, a Clear icon button (only while a filter is active) and Refresh.
import { ListFilter, RefreshCw, Search, X } from 'lucide-react';
import Avatar from '../Avatar.jsx';
import IconButton from '../IconButton.jsx';
import Input from '../Input.jsx';
import Popover from '../Popover.jsx';
import Select from '../Select.jsx';
import { activeFilterCount, hasActiveFilters } from './filters.js';

const AssigneeToggle = ({ user, pressed, onClick }) => (
  <button
    type="button"
    aria-pressed={pressed}
    aria-label={`Show only tasks assigned to ${user.name}`}
    title={user.name}
    onClick={onClick}
    className={`rounded-full ring-2 ring-offset-2 ring-offset-app focus:outline-none focus-visible:ring-brand-ring ${pressed ? 'ring-brand' : 'ring-transparent hover:ring-line'}`} // unslop-ignore: the toggle wraps a circular avatar, so its selection ring is a circle (docs/design.md section 5)
  >
    <Avatar user={user} size="md" />
  </button>
);

const BoardToolbar = ({ members, filters, searchText, onSearchText, labelText, onLabelText, onChange, onClear, onRefresh, refreshing }) => {
  const count = activeFilterCount(filters);

  return (
    <div role="search" aria-label="Filter tasks" className="mb-4 flex flex-wrap items-center gap-3">
      <Input
        aria-label="Search tasks"
        type="search"
        leadingIcon={Search}
        value={searchText}
        onChange={(event) => onSearchText(event.target.value)}
        placeholder="Search title or description"
        className="min-w-0 basis-full sm:flex-1 sm:basis-auto sm:max-w-xs"
      />

      <div role="group" aria-label="Filter by assignee" className="flex items-center -space-x-0.5 px-1">
        {members.map((member) => (
          <AssigneeToggle
            key={member.user._id}
            user={member.user}
            pressed={filters.assignee === member.user._id}
            onClick={() => onChange({ assignee: filters.assignee === member.user._id ? '' : member.user._id })}
          />
        ))}
      </div>

      <Popover
        label={count > 0 ? `Filters, ${count} active` : 'Filters'}
        triggerClassName="inline-flex h-10 items-center gap-2 rounded-md border border-line bg-surface px-3 text-sm font-medium text-fg hover:bg-surface-muted sm:h-8"
        triggerContent={
          <>
            <ListFilter size={16} aria-hidden="true" />
            Filters
            {count > 0 && <span className="rounded bg-brand px-1.5 text-xs tabular-nums text-white">{count}</span>}
          </>
        }
      >
        <div className="space-y-3">
          <Select label="Priority" value={filters.priority} onChange={(event) => onChange({ priority: event.target.value })}>
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
          <Input label="Label" value={labelText} onChange={(event) => onLabelText(event.target.value)} placeholder="e.g. bug" />
          <Input label="Due before" type="date" value={filters.dueBefore} onChange={(event) => onChange({ dueBefore: event.target.value })} />
        </div>
      </Popover>

      <div className="ml-auto flex items-center gap-1">
        {hasActiveFilters(filters) && <IconButton icon={X} label="Clear filters" onClick={onClear} />}
        <IconButton
          icon={RefreshCw}
          label="Refresh board"
          onClick={onRefresh}
          className={refreshing ? '[&_svg]:motion-safe:animate-spin' : ''}
        />
      </div>
    </div>
  );
};

export default BoardToolbar;
