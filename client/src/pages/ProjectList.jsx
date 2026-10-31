// Project list page (/projects). Shows the projects the user belongs to as a card grid, 9 per page.
// Search text, status filter and page number live in the URL query string (?search=&status=&page=),
// so the Back button and shared links keep the filters. Uses useFetch for loading, error and empty states.
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { listProjects } from '../api/projects.js';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import Select from '../components/Select.jsx';
import useDebounce from '../hooks/useDebounce.js';
import useFetch from '../hooks/useFetch.js';

const PAGE_SIZE = 9;
const STATUSES = ['active', 'archived'];

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

const ProjectList = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const statusParam = searchParams.get('status');
  const status = STATUSES.includes(statusParam) ? statusParam : '';
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1);

  // The box keeps what the user typed; the URL (and so the request) follows it after a short pause.
  const [searchText, setSearchText] = useState(search);
  const debouncedSearch = useDebounce(searchText);

  const updateParams = (changes, replace = false) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current);
        Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
        return next;
      },
      { replace }
    );
  };

  useEffect(() => {
    if (debouncedSearch.trim() !== search) updateParams({ search: debouncedSearch.trim(), page: '' }, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  const { data, loading, error, refetch } = useFetch(
    () => listProjects({ search: search || undefined, status: status || undefined, page, limit: PAGE_SIZE }),
    [search, status, page]
  );

  const hasFilters = Boolean(search || status);
  const clearFilters = () => {
    setSearchText('');
    setSearchParams({});
  };

  const renderContent = () => {
    if (loading) return <Loader label="Loading projects" />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    if (data.data.length === 0) {
      return hasFilters ? (
        <EmptyState
          title="No projects match your filters"
          message="Try a different search or status."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      ) : (
        <EmptyState
          title="No projects yet"
          message="Create your first project to start organising tasks."
          actionLabel="Create project"
          onAction={() => navigate('/projects/new')}
        />
      );
    }

    return (
      <>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.data.map((project) => (
            <li key={project._id}>
              <Link
                to={`/projects/${project._id}`}
                className="block h-full rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:opacity-80"
              >
                <Card className="flex h-full flex-col gap-3 transition-colors hover:border-indigo-300">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="min-w-0 break-words text-lg font-semibold text-slate-900">{project.name}</h2>
                    <Badge variant={project.status === 'active' ? 'success' : 'neutral'}>
                      {project.status === 'active' ? 'Active' : 'Archived'}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-sm text-slate-500">{project.description || 'No description'}</p>
                  <div className="mt-auto flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span>
                      {project.members.length} {project.members.length === 1 ? 'member' : 'members'}
                    </span>
                    <span>Updated {dateFormat.format(new Date(project.updatedAt))}</span>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <Pagination
            page={data.page}
            totalPages={Math.ceil(data.total / data.limit)}
            onPageChange={(next) => updateParams({ page: next === 1 ? '' : String(next) })}
          />
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
        <Button onClick={() => navigate('/projects/new')}>New project</Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <Input
          label="Search projects"
          type="search"
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by name"
        />
        <Select label="Status" value={status} onChange={(event) => updateParams({ status: event.target.value, page: '' })}>
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </Select>
      </div>

      {renderContent()}
    </div>
  );
};

export default ProjectList;
