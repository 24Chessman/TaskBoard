// Features (no props): six cards in a 3x2 grid (id "features", the target of the header link).
// Each card: an icon, a title and one sentence. The dashboard card says "Coming soon" because it is not built yet.
import { Activity, BarChart3, Columns3, MessageSquare, Tag, Users } from 'lucide-react';
import Badge from '../Badge.jsx';
import Card from '../Card.jsx';

const FEATURES = [
  { icon: Columns3, title: 'Kanban boards', text: 'Move tasks through To Do, In Progress, Review and Done.' },
  { icon: Tag, title: 'Tasks with labels and due dates', text: 'Set a priority, add labels and spot what is overdue.' },
  { icon: Users, title: 'Team roles', text: 'Owner, Member and Admin each get the right level of access.' },
  { icon: MessageSquare, title: 'Comments on every task', text: 'Discuss the work in the place where it happens.' },
  { icon: Activity, title: 'Activity feed', text: 'See who changed what, newest first.' },
  { icon: BarChart3, title: 'Dashboard charts', text: 'Charts of tasks by status, priority and person.', soon: true },
];

const Features = () => (
  <section id="features" aria-labelledby="features-title" className="scroll-mt-20 py-16 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <h2 id="features-title" className="text-3xl font-semibold tracking-tight text-fg">
          Everything a small team needs
        </h2>
        <p className="mt-3 text-lg text-fg-secondary">Simple tools to plan, assign and track the work.</p>
      </div>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, text, soon }) => (
          <li key={title}>
            <Card className="h-full p-5">
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand-fg"
              >
                <Icon size={20} />
              </span>
              <h3 className="mt-4 flex flex-wrap items-center gap-2 text-base font-semibold text-fg">
                {title}
                {soon && <Badge variant="neutral">Coming soon</Badge>}
              </h3>
              <p className="mt-1 text-sm text-fg-secondary">{text}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default Features;
