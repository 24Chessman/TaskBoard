// BoardMock props: columnIds (which columns to show, default all three), showFilters (adds a search and filter row
// above the columns), className. A static kanban board built from the real shared pieces (PriorityBadge, Badge,
// Avatar, StatusLozenge) with fake data from ./data.js. Decorative only: aria-hidden through MockWindow, and
// there are no links, buttons or inputs inside (the search box is drawn with plain elements).
import { Calendar, ListFilter, Search } from 'lucide-react';
import Avatar from '../../Avatar.jsx';
import AvatarGroup from '../../AvatarGroup.jsx';
import Badge from '../../Badge.jsx';
import PriorityBadge from '../../PriorityBadge.jsx';
import StatusLozenge from '../../StatusLozenge.jsx';
import { BOARD_COLUMNS, PEOPLE } from './data.js';
import MockWindow from './MockWindow.jsx';

const MockCard = ({ card }) => (
  <div className="space-y-2 rounded-lg border border-line bg-surface p-3">
    <p className="text-sm font-medium text-fg">{card.title}</p>
    <div className="flex flex-wrap items-center gap-1">
      <PriorityBadge priority={card.priority} />
      {card.labels.map((label) => (
        <Badge key={label}>{label}</Badge>
      ))}
    </div>
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1 text-xs text-fg-secondary">
        <Calendar size={12} aria-hidden="true" />
        {card.due}
      </span>
      <Avatar user={card.who} size="xs" />
    </div>
  </div>
);

const FilterRow = () => (
  <div className="flex items-center gap-3 border-b border-line px-3 py-2">
    <span className="flex h-8 w-44 items-center gap-2 rounded-md border border-line px-2 text-xs text-fg-secondary">
      <Search size={14} />
      Search tasks
    </span>
    <AvatarGroup users={Object.values(PEOPLE)} size="md" />
    <span className="inline-flex h-8 items-center gap-1.5 rounded-md border border-line px-2 text-xs font-medium text-fg-secondary">
      <ListFilter size={14} />
      Filters
    </span>
  </div>
);

const BoardMock = ({ columnIds, showFilters = false, className = '' }) => {
  const columns = columnIds ? BOARD_COLUMNS.filter((column) => columnIds.includes(column.id)) : BOARD_COLUMNS;
  return (
    <MockWindow title="Project TaskBoard" className={className}>
      {showFilters && <FilterRow />}
      <div className="flex gap-3 bg-app p-3">
        {columns.map((column) => (
          <div key={column.id} className="min-w-0 flex-1 space-y-2 rounded-lg bg-surface-muted p-2">
            <div className="flex items-center justify-between px-1 pb-1">
              <StatusLozenge status={column.id} />
              <span className="font-mono text-xs text-fg-secondary">{column.cards.length}</span>
            </div>
            {column.cards.map((card) => (
              <MockCard key={card.title} card={card} />
            ))}
          </div>
        ))}
      </div>
    </MockWindow>
  );
};

export default BoardMock;
