// HowItWorks (no props): three numbered steps (id "how-it-works", the target of the header link).
import { CircleCheck, FolderPlus, UserPlus } from 'lucide-react';

const STEPS = [
  { icon: FolderPlus, title: 'Create a project', text: 'Give it a name and you become its owner.' },
  { icon: UserPlus, title: 'Invite your team', text: 'Search for people and add them as members.' },
  { icon: CircleCheck, title: 'Move tasks to Done', text: 'Change a task’s status as the work moves forward.' },
];

const HowItWorks = () => (
  <section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 bg-app py-16 sm:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 id="how-title" className="max-w-2xl text-3xl font-semibold tracking-tight text-fg">
        From a new project to Done in three steps
      </h2>

      <ol className="mt-10 grid gap-8 md:grid-cols-3">
        {STEPS.map(({ icon: Icon, title, text }, index) => (
          <li key={title} className="flex gap-4">
            <span
              aria-hidden="true"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-fg">
                <Icon size={18} aria-hidden="true" className="text-brand" />
                {title}
              </h3>
              <p className="mt-1 max-w-xs text-sm text-fg-secondary">{text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  </section>
);

export default HowItWorks;
