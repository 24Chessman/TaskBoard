// ProjectLayout (no props): the parent route element for /projects/:projectId and everything under it.
// It loads the project once and handles loading, 403 (Forbidden page), 404 (NotFound page) and other errors
// (message with Retry). The project's navigation (Board, Dashboard, Activity, Settings) lives in the sidebar:
// this component publishes the project to the shell (ShellContext) for it. Each child page renders its own
// PageHeader, except the Board (index route), which gets one here until it is redesigned.
// Child screens read { project, projectRole, isOwner, refreshProject } with the useProject() hook.
import { useEffect } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { getProject } from '../api/projects.js';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import Forbidden from '../pages/Forbidden.jsx';
import NotFound from '../pages/NotFound.jsx';
import Badge from './Badge.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import Loader from './Loader.jsx';
import PageHeader from './shell/PageHeader.jsx';
import { useShellProject } from './shell/ShellContext.jsx';

const ProjectLayout = () => {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { setShellProject } = useShellProject();
  const { data: project, loading, error, status, refetch } = useFetch(() => getProject(projectId), [projectId]);

  // A global admin acts as owner on every project (same rule as the API).
  const membership = project?.members.find((member) => member.user?._id === user._id);
  const projectRole = user.role === 'admin' ? 'owner' : membership?.role;
  const isOwner = projectRole === 'owner';

  useEffect(() => {
    if (project) setShellProject({ project, projectRole, isOwner });
  }, [project, projectRole, isOwner, setShellProject]);
  useEffect(() => () => setShellProject(null), [setShellProject]);

  if (loading && !project) return <Loader label="Loading project" />;
  if (status === 403) return <Forbidden />;
  if (status === 404) return <NotFound />;
  if (error || !project) return <ErrorMessage message={error || 'Could not load the project'} onRetry={refetch} />;

  const isBoard = pathname.replace(/\/$/, '') === `/projects/${projectId}`;

  return (
    <div className="space-y-6">
      {isBoard && (
        <PageHeader
          breadcrumbs={[{ label: 'Projects', to: '/projects' }, { label: project.name }]}
          title={project.name}
          titleExtra={
            <Badge variant={project.status === 'active' ? 'success' : 'neutral'}>
              {project.status === 'active' ? 'Active' : 'Archived'}
            </Badge>
          }
        />
      )}
      <Outlet context={{ project, projectRole, isOwner, refreshProject: refetch }} />
    </div>
  );
};

export default ProjectLayout;
