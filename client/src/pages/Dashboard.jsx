// Dashboard page (/projects/:projectId/dashboard): a placeholder until the dashboard is built.
import { BarChart3 } from 'lucide-react';
import EmptyState from '../components/EmptyState.jsx';
import PageHeader from '../components/shell/PageHeader.jsx';
import useProject from '../hooks/useProject.js';

const Dashboard = () => {
  const { project } = useProject();

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Projects', to: '/projects' },
          { label: project.name, to: `/projects/${project._id}` },
          { label: 'Dashboard' },
        ]}
        title="Dashboard"
      />
      <EmptyState
        icon={BarChart3}
        title="Dashboard is coming soon"
        message="Charts and totals for this project will show up here."
      />
    </div>
  );
};

export default Dashboard;
