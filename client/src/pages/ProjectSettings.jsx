// Project settings page (/projects/:projectId/settings). Owners and global admins only: anyone else sees the
// Forbidden page, even when opening the URL directly. Sections live in components/settings/:
// details (edit, PUT), members (list, remove, add), status (archive / reactivate) and the danger zone (delete).
// The project comes from useProject(); after every change refreshProject() reloads it.
import DangerSection from '../components/settings/DangerSection.jsx';
import DetailsSection from '../components/settings/DetailsSection.jsx';
import MembersSection from '../components/settings/MembersSection.jsx';
import StatusSection from '../components/settings/StatusSection.jsx';
import PageHeader from '../components/shell/PageHeader.jsx';
import useProject from '../hooks/useProject.js';
import Forbidden from './Forbidden.jsx';

const ProjectSettings = () => {
  const { project, isOwner, refreshProject } = useProject();

  if (!isOwner) return <Forbidden />;

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Projects', to: '/projects' },
          { label: project.name, to: `/projects/${project._id}` },
          { label: 'Settings' },
        ]}
        title="Settings"
      />
      <div className="divide-y divide-line">
        <DetailsSection project={project} refreshProject={refreshProject} />
        <MembersSection project={project} refreshProject={refreshProject} />
        <StatusSection project={project} refreshProject={refreshProject} />
      </div>
      <DangerSection project={project} />
    </div>
  );
};

export default ProjectSettings;
