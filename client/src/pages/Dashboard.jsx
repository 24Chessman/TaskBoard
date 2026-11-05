// Dashboard page (/projects/:projectId/dashboard, a child of ProjectLayout, which already handles 403 and 404).
// Fetches the project's numbers once (GET /projects/:projectId/dashboard) and shows five stat cards and five charts
// (components/dashboard/). While a refresh runs the previous numbers stay on screen: the full-page loader only shows for
// the very first load. A project with no tasks shows an empty state with a link to the Board.
import { RefreshCw } from 'lucide-react';
import { useRef } from 'react';
import { getDashboard } from '../api/dashboard.js';
import CreatedChart from '../components/dashboard/CreatedChart.jsx';
import LabelsChart from '../components/dashboard/LabelsChart.jsx';
import PriorityChart from '../components/dashboard/PriorityChart.jsx';
import StatCards from '../components/dashboard/StatCards.jsx';
import StatusChart from '../components/dashboard/StatusChart.jsx';
import WorkloadChart from '../components/dashboard/WorkloadChart.jsx';
import { NoProjectsArt } from '../components/art/EmptyArt.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import IconButton from '../components/IconButton.jsx';
import LinkButton from '../components/landing/LinkButton.jsx';
import Loader from '../components/Loader.jsx';
import PageHeader from '../components/shell/PageHeader.jsx';
import useFetch from '../hooks/useFetch.js';
import useProject from '../hooks/useProject.js';

const Dashboard = () => {
  const { project } = useProject();
  const { data, loading, error, refetch } = useFetch(() => getDashboard(project._id), [project._id]);

  // Keep showing the last result while a refresh runs
  const lastData = useRef(null);
  if (data) lastData.current = data;
  const shown = data || lastData.current;

  const renderBody = () => {
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (!shown) return <Loader label="Loading dashboard" />;

    if (shown.total === 0) {
      return (
        <EmptyState art={<NoProjectsArt />} title="No tasks yet" message="Add tasks on the board and the charts will fill in here.">
          <LinkButton to={`/projects/${project._id}`} className="mt-4">
            Go to the board
          </LinkButton>
        </EmptyState>
      );
    }

    return (
      <>
        <StatCards data={shown} />
        <div className="grid gap-4 lg:grid-cols-2">
          <StatusChart byStatus={shown.byStatus} total={shown.total} />
          <PriorityChart byPriority={shown.byPriority} total={shown.total} />
          <CreatedChart createdPerDay={shown.createdPerDay} />
          <WorkloadChart perMember={shown.perMember} unassigned={shown.unassigned} />
          <LabelsChart topLabels={shown.topLabels} />
        </div>
      </>
    );
  };

  return (
    <div>
      <PageHeader
        breadcrumbs={[
          { label: 'Projects', to: '/projects' },
          { label: project.name, to: `/projects/${project._id}` },
          { label: 'Dashboard' },
        ]}
        title="Dashboard"
        actions={
          <IconButton
            icon={RefreshCw}
            label="Refresh dashboard"
            onClick={refetch}
            className={loading && shown ? '[&_svg]:motion-safe:animate-spin' : ''}
          />
        }
      />
      {renderBody()}
    </div>
  );
};

export default Dashboard;
