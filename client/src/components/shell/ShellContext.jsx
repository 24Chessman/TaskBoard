// ShellContext: lets ProjectLayout (which fetches the project) tell the sidebar (in Layout) about it, so the
// project is fetched once. ShellProvider wraps Layout; ProjectLayout calls setShellProject({ project, projectRole,
// isOwner }) after its fetch succeeds and setShellProject(null) when it unmounts. useShellProject() returns
// { shellProject, setShellProject }; outside a provider it returns an empty, harmless value.
import { createContext, useContext, useMemo, useState } from 'react';

const ShellContext = createContext({ shellProject: null, setShellProject: () => {} });

export const ShellProvider = ({ children }) => {
  const [shellProject, setShellProject] = useState(null);
  const value = useMemo(() => ({ shellProject, setShellProject }), [shellProject]);
  return <ShellContext.Provider value={value}>{children}</ShellContext.Provider>;
};

export const useShellProject = () => useContext(ShellContext);
