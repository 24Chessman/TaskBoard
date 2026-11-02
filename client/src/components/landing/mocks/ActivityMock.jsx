// ActivityMock (no props): a static activity timeline with the same look as the Activity page (a round icon per
// action on a thin line, bold actor name, relative time on the right). Fake data. Decorative only: aria-hidden
// through MockWindow, nothing focusable.
import { ArrowRightLeft, MessageSquare, Plus, UserPlus } from 'lucide-react';
import MockWindow from './MockWindow.jsx';

const ENTRIES = [
  { icon: ArrowRightLeft, who: 'Lee Park', text: "moved 'Set up analytics' to Review", when: '12 min ago' },
  { icon: MessageSquare, who: 'Sam Okoye', text: "commented on 'Design pricing table'", when: '2 hours ago' },
  { icon: Plus, who: 'Ava Chen', text: "created task 'Audit old docs pages'", when: '3 hours ago' },
  { icon: UserPlus, who: 'Ava Chen', text: 'added Lee Park to the project', when: 'Yesterday' },
];

const ActivityMock = ({ className = '' }) => (
  <MockWindow title="Activity" className={className}>
    <div className="p-4">
      <p className="mb-3 text-sm font-semibold text-fg">Today</p>
      <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-3 before:top-2 before:w-px before:bg-line">
        {ENTRIES.map(({ icon: Icon, who, text, when }) => (
          <li key={text} className="relative flex items-start gap-3">
            <span className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-fg-secondary">
              <Icon size={12} />
            </span>
            <p className="min-w-0 flex-1 pt-0.5 text-sm text-fg">
              <strong className="font-semibold">{who}</strong> {text}
            </p>
            <span className="shrink-0 pt-0.5 text-xs text-fg-secondary">{when}</span>
          </li>
        ))}
      </ol>
    </div>
  </MockWindow>
);

export default ActivityMock;
