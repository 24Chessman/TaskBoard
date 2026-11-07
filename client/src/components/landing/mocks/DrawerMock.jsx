// DrawerMock (no props): a static task view with the description and two comments on the left and the details
// (status, priority, assignee, labels, due date) on the right. Built from shared pieces with fake data.
// Decorative only: aria-hidden through MockWindow, nothing focusable.
import { Calendar } from 'lucide-react';
import Avatar from '../../Avatar.jsx';
import Badge from '../../Badge.jsx';
import PriorityBadge from '../../PriorityBadge.jsx';
import StatusLozenge from '../../StatusLozenge.jsx';
import { PEOPLE } from './data.js';
import MockWindow from './MockWindow.jsx';

const COMMENTS = [
  { who: PEOPLE.sam, when: '2 hours ago', text: 'Using the privacy-friendly option, so no cookie banner is needed.' },
  { who: PEOPLE.lee, when: 'Yesterday', text: 'I will check the events on the staging site tomorrow.' },
];

const Detail = ({ label, children }) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <dt className="text-xs text-fg-secondary">{label}</dt>
    <dd className="flex items-center gap-1.5 text-xs text-fg">{children}</dd>
  </div>
);

const DrawerMock = ({ className = '' }) => (
  <MockWindow title="Set up analytics" className={className}>
    <div className="grid gap-0 sm:grid-cols-[minmax(0,1fr)_14rem]">
      <div className="space-y-4 p-4">
        <h3 className="text-base font-semibold text-fg">Set up analytics</h3>
        <p className="text-sm text-fg-secondary">Add page views and sign-up events to the marketing site.</p>
        <ul className="space-y-3">
          {COMMENTS.map((comment) => (
            <li key={comment.when} className="flex items-start gap-2">
              <Avatar user={comment.who} size="sm" />
              <div className="min-w-0">
                <p className="text-xs text-fg-secondary">
                  <span className="font-medium text-fg">{comment.who.name}</span> {comment.when}
                </p>
                <p className="text-sm text-fg">{comment.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <dl className="divide-y divide-line border-t border-line bg-app px-4 py-2 sm:border-l sm:border-t-0">
        <Detail label="Status">
          <StatusLozenge status="in_progress" />
        </Detail>
        <Detail label="Priority">
          <PriorityBadge priority="high" />
        </Detail>
        <Detail label="Lead">
          <Avatar user={PEOPLE.lee} size="xs" />
          Lee Park
        </Detail>
        <Detail label="Labels">
          <Badge>infra</Badge>
        </Detail>
        <Detail label="Due">
          <Calendar size={12} aria-hidden="true" />
          Nov 4
        </Detail>
      </dl>
    </div>
  </MockWindow>
);

export default DrawerMock;
