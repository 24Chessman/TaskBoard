// RouteTitle: sets document.title for the current route ("Board - TaskBoard"), so browser tabs, history and screen
// readers can tell the pages apart. Renders nothing. The first matching pattern wins, so "/projects/new" comes
// before "/projects/:projectId". An unknown path is the "Page not found" page.
import { useEffect } from 'react';
import { matchPath, useLocation } from 'react-router-dom';

const NAME = 'TaskBoard';
const TITLES = [
  ['/', null],
  ['/login', 'Log in'],
  ['/register', 'Create account'],
  ['/projects', 'Projects'],
  ['/projects/new', 'New project'],
  ['/projects/:projectId', 'Board'],
  ['/projects/:projectId/dashboard', 'Dashboard'],
  ['/projects/:projectId/activity', 'Activity'],
  ['/projects/:projectId/settings', 'Project settings'],
  ['/profile', 'Profile'],
  ['/admin/users', 'Users'],
];

const RouteTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const match = TITLES.find(([pattern]) => matchPath({ path: pattern, end: true }, pathname));
    const title = match ? match[1] : 'Page not found';
    document.title = title ? `${title} - ${NAME}` : NAME;
  }, [pathname]);

  return null;
};

export default RouteTitle;
