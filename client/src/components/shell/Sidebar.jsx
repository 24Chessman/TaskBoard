// SidebarNav props: onNavigate (optional, called when a link is chosen; the mobile drawer uses it to close).
// The navigation itself: a "Workspace" group (Projects, and Admin for admins) and, while a project is open, a
// project group (back link, project name and status, Board, Dashboard, Activity, and Settings for owners and
// admins). The active item has aria-current="page". Sidebar wraps it in the fixed 240px column (desktop only).
import { Activity, ArrowLeft, BarChart3, Columns3, LayoutGrid, Settings, Shield } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import Badge from '../Badge.jsx';
import ProjectAvatar from '../ProjectAvatar.jsx';
import { useShellProject } from './ShellContext.jsx';

const itemClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring ${
    isActive ? 'bg-brand-soft text-brand-fg' : 'text-fg-secondary hover:bg-surface-muted hover:text-fg active:bg-line'
  }`;

const groupTitle = 'px-3 pb-1 text-xs font-medium text-fg-secondary';

const Item = ({ to, icon: Icon, end, onNavigate, children }) => (
  <NavLink to={to} end={end} onClick={onNavigate} className={itemClass}>
    <Icon size={18} aria-hidden="true" className="shrink-0" />
    <span className="truncate">{children}</span>
  </NavLink>
);

export const SidebarNav = ({ onNavigate }) => {
  const { user } = useAuth();
  const { shellProject } = useShellProject();
  const project = shellProject?.project;
  const base = project ? `/projects/${project._id}` : '';

  return (
    <div className="space-y-6">
      <nav aria-label="Workspace">
        <h2 className={groupTitle}>Workspace</h2>
        <ul className="space-y-1">
          <li>
            <Item to="/projects" icon={LayoutGrid} end onNavigate={onNavigate}>
              Projects
            </Item>
          </li>
          {user?.role === 'admin' && (
            <li>
              <Item to="/admin/users" icon={Shield} onNavigate={onNavigate}>
                Admin
              </Item>
            </li>
          )}
        </ul>
      </nav>

      {project && (
        <nav aria-label="Project" className="border-t border-line pt-4">
          <NavLink
            to="/projects"
            end
            onClick={onNavigate}
            className="mb-3 flex items-center gap-2 rounded-md px-3 py-1 text-sm text-fg-secondary hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            All projects
          </NavLink>
          <div className="mb-3 flex items-center gap-3 px-3">
            <ProjectAvatar name={project.name} size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg" title={project.name}>
                {project.name}
              </p>
              <Badge variant={project.status === 'active' ? 'success' : 'neutral'}>
                {project.status === 'active' ? 'Active' : 'Archived'}
              </Badge>
            </div>
          </div>
          <ul className="space-y-1">
            <li>
              <Item to={base} icon={Columns3} end onNavigate={onNavigate}>
                Board
              </Item>
            </li>
            <li>
              <Item to={`${base}/dashboard`} icon={BarChart3} onNavigate={onNavigate}>
                Dashboard
              </Item>
            </li>
            <li>
              <Item to={`${base}/activity`} icon={Activity} onNavigate={onNavigate}>
                Activity
              </Item>
            </li>
            {shellProject.isOwner && (
              <li>
                <Item to={`${base}/settings`} icon={Settings} onNavigate={onNavigate}>
                  Settings
                </Item>
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
};

const Sidebar = () => (
  <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-60 shrink-0 overflow-y-auto border-r border-line bg-surface p-4 md:block">
    <SidebarNav />
  </aside>
);

export default Sidebar;
