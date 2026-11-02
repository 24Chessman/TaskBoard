// Activity page (/projects/:projectId/activity, a child of ProjectLayout). A timeline of what happened in the
// project, newest first, grouped under day headings (Today, Yesterday, then dates) and drawn by
// components/activity/ActivityTimeline.jsx (icon, actor name in bold plus message, relative time).
// 20 entries per page; the page number lives in the URL.
// Entries are written just after the action that causes them, so a Refresh button reloads the feed.
import { RefreshCw } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { listActivity } from '../api/activity.js';
import ActivityTimeline from '../components/activity/ActivityTimeline.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import PageHeader from '../components/shell/PageHeader.jsx';
import useFetch from '../hooks/useFetch.js';
import useProject from '../hooks/useProject.js';
import { groupByDay } from '../utils/dates.js';

const PAGE_SIZE = 20;

const Activity = () => {
  const { project } = useProject();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1);
  const goToPage = (next) => setSearchParams(next === 1 ? {} : { page: String(next) });

  const { data, loading, error, refetch } = useFetch(
    () => listActivity(project._id, { page, limit: PAGE_SIZE }),
    [project._id, page]
  );

  const renderFeed = () => {
    if (loading && !data) return <Loader label="Loading activity" />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    if (data.total === 0) {
      return (
        <EmptyState
          title="No activity yet"
          message="Changes to tasks, members and comments will show up here."
        />
      );
    }
    if (data.data.length === 0) {
      return (
        <EmptyState
          title="Nothing on this page"
          message="There are fewer entries than that."
          actionLabel="Go to the first page"
          onAction={() => goToPage(1)}
        />
      );
    }

    return (
      <>
        <ActivityTimeline groups={groupByDay(data.data)} />
        <div className="mt-6">
          <Pagination page={data.page} totalPages={Math.ceil(data.total / data.limit)} onPageChange={goToPage} />
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
          { label: 'Activity' },
        ]}
        title="Activity"
        description="What changed in this project, newest first."
        actions={
          <Button
            variant="secondary"
            leftIcon={RefreshCw}
            onClick={refetch}
            loading={loading && Boolean(data)}
            disabled={loading && !data}
          >
            Refresh
          </Button>
        }
      />

      {renderFeed()}
    </div>
  );
};

export default Activity;
