// RolesMock (no props): a small static table of the three roles and what each one can do. The same facts are
// written in the text next to it on the page. Decorative only: aria-hidden through MockWindow, nothing focusable.
import { Check } from 'lucide-react';
import Badge from '../../Badge.jsx';
import MockWindow from './MockWindow.jsx';

const ROLES = [
  { role: 'Admin', variant: 'primary', can: ['Open every project', 'Manage users and roles', 'Act as owner anywhere'] },
  { role: 'Owner', variant: 'info', can: ['Edit project settings', 'Add and remove members', 'Archive or delete the project'] },
  { role: 'Member', variant: 'neutral', can: ['Create and move tasks', 'Comment on tasks', 'See the activity history'] },
];

const RolesMock = ({ className = '' }) => (
  <MockWindow title="Roles" className={className}>
    <div className="divide-y divide-line">
      {ROLES.map(({ role, variant, can }) => (
        <div key={role} className="grid items-start gap-2 p-4 sm:grid-cols-[6rem_minmax(0,1fr)]">
          <div>
            <Badge variant={variant}>{role}</Badge>
          </div>
          <ul className="space-y-1">
            {can.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-fg">
                <Check size={14} className="shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </MockWindow>
);

export default RolesMock;
