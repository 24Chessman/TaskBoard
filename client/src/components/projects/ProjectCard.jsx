// ProjectCard props: project (a project from the API: _id, name, description, status, members, updatedAt).
// The whole card is one link to the project with one accessible name ("<name>, Active"); the contents are
// decorative extras. Shows the avatar, name, status, a two-line description, the members and the update date.
import { Link } from 'react-router-dom';
import AvatarGroup from '../AvatarGroup.jsx';
import Badge from '../Badge.jsx';
import ProjectAvatar from '../ProjectAvatar.jsx';

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

const ProjectCard = ({ project }) => {
  const statusLabel = project.status === 'active' ? 'Active' : 'Archived';

  return (
    <Link
      to={`/projects/${project._id}`}
      aria-label={`${project.name}, ${statusLabel}`}
      className="flex h-full flex-col gap-3 rounded-lg border border-line bg-surface p-4 transition-colors hover:border-fg-muted hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 active:bg-surface-muted"
    >
      <div className="flex items-start gap-3" aria-hidden="true">
        <ProjectAvatar name={project.name} size="md" />
        <div className="min-w-0 flex-1">
          <h2 className="break-words text-base font-semibold text-fg">{project.name}</h2>
          <Badge variant={project.status === 'active' ? 'success' : 'neutral'} className="mt-1">
            {statusLabel}
          </Badge>
        </div>
      </div>
      <p aria-hidden="true" className="line-clamp-2 text-sm text-fg-secondary">
        {project.description || 'No description'}
      </p>
      <div aria-hidden="true" className="mt-auto flex items-center justify-between gap-2 pt-1">
        <AvatarGroup users={project.members.map((member) => member.user)} max={4} size="sm" />
        <span className="text-xs text-fg-secondary">Updated {dateFormat.format(new Date(project.updatedAt))}</span>
      </div>
    </Link>
  );
};

export default ProjectCard;
