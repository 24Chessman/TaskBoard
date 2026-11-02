// BoardPreview (no props): a static mock of the kanban board for the hero, built in HTML and Tailwind (no image).
// Generic sample data only. It is purely decorative: the whole thing is aria-hidden and contains nothing
// focusable (no links, buttons or inputs). A soft indigo glow sits behind it (a blurred box, CSS only).
import { Calendar, CheckCircle2, Circle, CircleDot } from 'lucide-react';
import Avatar from '../Avatar.jsx';
import Badge from '../Badge.jsx';
import PriorityBadge from '../PriorityBadge.jsx';

const COLUMNS = [
  {
    title: 'To Do',
    icon: Circle,
    cards: [
      { title: 'Write the project brief', priority: 'high', label: 'planning', due: 'Nov 12', who: 'Ava Chen' },
      { title: 'Design the sign-in page', priority: 'medium', label: 'design', due: 'Nov 14', who: 'Sam Okoye' },
    ],
  },
  {
    title: 'In Progress',
    icon: CircleDot,
    cards: [{ title: 'Set up the database', priority: 'high', label: 'backend', due: 'Nov 10', who: 'Lee Park' }],
  },
  {
    title: 'Done',
    icon: CheckCircle2,
    cards: [{ title: 'Choose a project name', priority: 'low', label: 'planning', due: 'Nov 3', who: 'Ava Chen' }],
  },
];

const PreviewCard = ({ card }) => (
  <div className="space-y-2 rounded-lg border border-line bg-surface p-2.5 shadow-sm">
    <p className="text-sm font-medium text-fg">{card.title}</p>
    <div className="flex flex-wrap items-center gap-1">
      <PriorityBadge priority={card.priority} />
      <Badge variant="primary">{card.label}</Badge>
    </div>
    <div className="flex items-center justify-between gap-2">
      <span className="inline-flex items-center gap-1 text-xs text-fg-secondary">
        <Calendar size={12} aria-hidden="true" />
        {card.due}
      </span>
      <Avatar user={{ name: card.who }} size="xs" />
    </div>
  </div>
);

const BoardPreview = () => (
  <div aria-hidden="true" className="relative isolate">
    <div className="absolute -inset-4 -z-10 rounded-3xl bg-brand/20 blur-3xl" />
    <div className="rounded-xl border border-line bg-surface p-3 shadow-lg">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {COLUMNS.map((column, index) => (
          <div key={column.title} className={`rounded-lg bg-surface-muted p-2 ${index === 2 ? 'hidden sm:block' : ''}`}>
            <div className="flex items-center justify-between px-1 pb-2 text-xs font-medium text-fg-secondary">
              <span className="inline-flex items-center gap-1">
                <column.icon size={14} />
                {column.title}
              </span>
              <span>{column.cards.length}</span>
            </div>
            <div className="space-y-2">
              {column.cards.map((card) => (
                <PreviewCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default BoardPreview;
