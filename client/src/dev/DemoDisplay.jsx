// Temporary dev page, development only: lozenges, avatars, cards, empty state, loader, error and the logo.
import { FolderOpen } from 'lucide-react';
import Avatar from '../components/Avatar.jsx';
import AvatarGroup from '../components/AvatarGroup.jsx';
import Badge from '../components/Badge.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import Logo from '../components/Logo.jsx';
import PriorityBadge from '../components/PriorityBadge.jsx';
import ProjectAvatar from '../components/ProjectAvatar.jsx';
import StatusLozenge from '../components/StatusLozenge.jsx';
import Section from './Section.jsx';

const people = [
  { _id: '1', name: 'Naitik Sutariya' },
  { _id: '2', name: 'Harshal Prajapati' },
  { _id: '3', name: 'Jay Trivedi' },
  { _id: '4', name: 'Jaydip Patel' },
  { _id: '5', name: 'Ada Lovelace' },
  { _id: '6', name: 'Grace Hopper' },
];

const DemoDisplay = () => (
  <>
    <Section title="Badge lozenges">
      <div className="flex flex-wrap gap-2">
        {['neutral', 'primary', 'success', 'warning', 'danger', 'info'].map((variant) => (
          <Badge key={variant} variant={variant}>
            {variant}
          </Badge>
        ))}
      </div>
    </Section>

    <Section title="StatusLozenge and PriorityBadge (icon + text, never colour alone)">
      <div className="flex flex-wrap gap-2">
        {['todo', 'in_progress', 'review', 'done'].map((status) => (
          <StatusLozenge key={status} status={status} />
        ))}
        {['low', 'medium', 'high'].map((priority) => (
          <PriorityBadge key={priority} priority={priority} />
        ))}
      </div>
    </Section>

    <Section title="Avatar: xs, sm, md, deleted user">
      <div className="flex flex-wrap items-center gap-3">
        <Avatar user={people[0]} size="xs" />
        <Avatar user={people[1]} size="sm" />
        <Avatar user={people[2]} size="md" />
        <Avatar user={people[3]} size="md" />
        <Avatar user={null} size="md" />
        <Avatar user={null} size="md" emptyLabel="Unassigned" />
      </div>
    </Section>

    <Section title="AvatarGroup and ProjectAvatar">
      <div className="flex flex-wrap items-center gap-6">
        <AvatarGroup users={people} max={3} />
        <AvatarGroup users={people.slice(0, 2)} size="md" />
        <AvatarGroup users={people} max={4} size="xs" />
        <ProjectAvatar name="Website redesign" size="sm" />
        <ProjectAvatar name="Mobile app" />
        <ProjectAvatar name="Q4 planning" size="lg" />
      </div>
    </Section>

    <Section title="Card">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>A plain card.</Card>
        <Card hoverable>A hoverable card (shadow rises on hover).</Card>
      </div>
    </Section>

    <Section title="EmptyState, Loader, ErrorMessage">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <EmptyState title="No projects yet" message="Create your first project to get started." actionLabel="Create project" onAction={() => {}} />
        </Card>
        <Card>
          <EmptyState icon={FolderOpen} title="No tasks match your filters" message="Try clearing a filter." />
        </Card>
      </div>
      <Loader />
      <ErrorMessage message="Could not load projects." onRetry={() => {}} />
    </Section>

    <Section title="Logo">
      <div className="flex flex-wrap items-end gap-6">
        <Logo size={20} />
        <Logo />
        <Logo size={40} />
        <Logo size={56} />
        <Logo showWordmark={false} size={24} />
        <Logo showWordmark={false} size={40} />
      </div>
    </Section>
  </>
);

export default DemoDisplay;
