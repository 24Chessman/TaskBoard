// Activity page (/projects/:projectId/activity, a child of ProjectLayout). A timeline of what happened in the
// project, newest first, grouped under day headings (Today, Yesterday, then dates). Each entry shows the actor's
// avatar, their name in bold followed by the message (for example "Harshal moved 'Login page' to Review"), and the
// relative time with the full date and time on hover. 20 entries per page; the page number lives in the URL.
// Entries are written just after the action that causes them, so a Refresh button reloads the feed.
// A deleted user shows as "Deleted user". All text is rendered as plain text.
import { useSearchParams } from 'react-router-dom';
import { listActivity } from '../api/activity.js';
import Avatar from '../components/Avatar.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import useFetch from '../hooks/useFetch.js';
import useProject from '../hooks/useProject.js';
import { formatDateTime, groupByDay, timeAgo } from '../utils/dates.js';

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
        <div className="space-y-6">
          {groupByDay(data.data).map((group) => (
            <section key={group.key} aria-labelledby={`day-${group.key}`}>
              <h3 id={`day-${group.key}`} className="text-sm font-semibold text-slate-900">
                {group.label}
              </h3>
              <ol className="mt-2 divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
                {group.items.map((entry) => (
                  <li key={entry._id} className="flex items-start gap-3 p-3">
                    <Avatar user={entry.actor} />
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm text-slate-900">
                        <strong className="font-semibold">{entry.actor ? entry.actor.name : 'Deleted user'}</strong>{' '}
                        {entry.message}
                      </p>
                      <time dateTime={entry.createdAt} title={formatDateTime(entry.createdAt)} className="text-xs text-slate-500">
                        {timeAgo(entry.createdAt)}
                      </time>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
        <Pagination page={data.page} totalPages={Math.ceil(data.total / data.limit)} onPageChange={goToPage} />
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Activity</h2>
        <Button variant="secondary" onClick={refetch} loading={loading && Boolean(data)} disabled={loading && !data}>
          Refresh
        </Button>
      </div>

      {renderFeed()}
    </div>
  );
};

export default Activity;
