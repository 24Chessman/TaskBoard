// useProject(): returns { project, projectRole, isOwner, refreshProject } from the nearest ProjectLayout.
// Screens under /projects/:projectId (board, dashboard, activity, settings) should read the project with this
// hook instead of fetching it again:
//   const { project, projectRole, isOwner, refreshProject } = useProject();
//   project         the project with members populated (member.user has _id, name, email)
//   projectRole     the current user's role in it: "owner" or "member" (a global admin counts as "owner")
//   isOwner         true when projectRole is "owner"
//   refreshProject  reloads the project after a change (for example after adding a member)
// It only works for components rendered inside ProjectLayout's <Outlet />.
import { useOutletContext } from 'react-router-dom';

const useProject = () => useOutletContext();

export default useProject;
