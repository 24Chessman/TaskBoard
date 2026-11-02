// TrustStrip (no props): one row of three short facts under the hero. No customer logos or numbers: only what
// the product really has. The heading is for screen readers.
import { Activity, Columns3, Shield } from 'lucide-react';

const FACTS = [
  { icon: Columns3, label: 'Kanban boards' },
  { icon: Shield, label: 'Roles and permissions' },
  { icon: Activity, label: 'Activity history' },
];

const TrustStrip = () => (
  <section aria-labelledby="highlights-title" className="border-y border-line bg-app">
    <h2 id="highlights-title" className="sr-only">
      What TaskBoard includes
    </h2>
    <ul className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-4 py-6 sm:px-6 lg:px-8">
      {FACTS.map(({ icon: Icon, label }) => (
        <li key={label} className="flex items-center gap-2 text-sm font-medium text-fg-secondary">
          <Icon size={18} aria-hidden="true" className="text-brand" />
          {label}
        </li>
      ))}
    </ul>
  </section>
);

export default TrustStrip;
