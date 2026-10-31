import useProject from '../hooks/useProject.js';

const Dashboard = () => {
  const { project, projectRole } = useProject();

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-indigo-600">Dashboard</h1>
      <p className="mt-2 text-sm text-slate-600">
        Route: <code className="rounded bg-slate-100 px-1.5 py-0.5">/projects/:projectId/dashboard</code>
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Project: <span className="font-medium">{project.name}</span>
      </p>
      <p className="mt-1 text-sm text-slate-600">
        Your role: <span className="font-medium">{projectRole}</span>
      </p>
      <p className="mt-1 text-sm text-slate-600">Module owner: Jaydip</p>
    </section>
  );
};

export default Dashboard;
