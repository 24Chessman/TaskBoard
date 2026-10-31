// ProjectLayout (no props): the parent route element for /projects/:projectId and everything under it.
// It loads the project once and handles loading, 403 (Forbidden page), 404 (NotFound page) and other errors
// (message with Retry). It renders the breadcrumb, the project header and the tabs (Board, Dashboard, Activity,
// and Settings for owners and admins), then the child screen through <Outlet context={...} />.
// Child screens read { project, projectRole, isOwner, refreshProject } with the useProject() hook.
import { Link, NavLink, Outlet, useLocation, useParams } from 'react-router-dom';
import { getProject } from '../api/projects.js';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import Forbidden from '../pages/Forbidden.jsx';
import NotFound from '../pages/NotFound.jsx';
import Badge from './Badge.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import Loader from './Loader.jsx';

const TABS = [
  { label: 'Board', path: '', end: true },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Activity', path: '/activity' },
  { label: 'Settings', path: '/settings', ownerOnly: true },
];

const tabClass = ({ isActive }) =>
  `-mb-px whitespace-nowrap border-b-2 px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:bg-slate-100 ${
    isActive
      ? 'border-indigo-600 text-indigo-600'
      : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900'
  }`;

const crumbLinkClass =
  'rounded hover:text-slate-900 active:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

const ProjectLayout = () => {
  const { projectId } = useParams();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { data: project, loading, error, status, refetch } = useFetch(() => getProject(projectId), [projectId]);

  if (loading && !project) return <Loader label="Loading project" />;
  if (status === 403) return <Forbidden />;
  if (status === 404) return <NotFound />;
  if (error || !project) return <ErrorMessage message={error || 'Could not load the project'} onRetry={refetch} />;

  // A global admin acts as owner on every project (same rule as the API).
  const membership = project.members.find((member) => member.user?._id === user._id);
  const projectRole = user.role === 'admin' ? 'owner' : membership?.role;
  const isOwner = projectRole === 'owner';

  const base = `/projects/${projectId}`;
  const currentTab = TABS.find((tab) => tab.path && pathname.startsWith(`${base}${tab.path}`)) || TABS[0];

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1 text-sm text-slate-500">
            <li>
              <Link to="/projects" className={crumbLinkClass}>
                Projects
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={base} className={crumbLinkClass}>
                {project.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-slate-900">
              {currentTab.label}
            </li>
          </ol>
        </nav>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="min-w-0 break-words text-2xl font-semibold text-slate-900">{project.name}</h1>
          <Badge variant={project.status === 'active' ? 'success' : 'neutral'}>
            {project.status === 'active' ? 'Active' : 'Archived'}
          </Badge>
        </div>

        <nav aria-label="Project sections" className="flex gap-1 overflow-x-auto border-b border-slate-200">
          {TABS.filter((tab) => !tab.ownerOnly || isOwner).map((tab) => (
            <NavLink key={tab.label} to={`${base}${tab.path}`} end={tab.end} className={tabClass}>
              {tab.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <Outlet context={{ project, projectRole, isOwner, refreshProject: refetch }} />
    </div>
  );
};

export default ProjectLayout;
