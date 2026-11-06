// Project list page (/projects). Shows the projects the user belongs to as a card grid, 9 per page.
// Search text, status filter and page number live in the URL query string (?search=&status=&page=),
// so the Back button and shared links keep the filters. Uses useFetch for loading, error and empty states.
import { useEffect, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { listProjects } from '../api/projects.js';
import { NoProjectsArt, NoResultsArt } from '../components/art/EmptyArt.jsx';
import Button from '../components/Button.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import PageSkeleton from '../components/PageSkeleton.jsx';
import Pagination from '../components/Pagination.jsx';
import ProjectCard from '../components/projects/ProjectCard.jsx';
import Select from '../components/Select.jsx';
import PageHeader from '../components/shell/PageHeader.jsx';
import useDebounce from '../hooks/useDebounce.js';
import useFetch from '../hooks/useFetch.js';

const PAGE_SIZE = 9;
const STATUSES = ['active', 'archived'];

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
    if (loading) return <PageSkeleton variant="cards" label="Loading projects" />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    if (data.data.length === 0) {
      return hasFilters ? (
        <EmptyState
          art={<NoResultsArt />}
          title="No projects match your filters"
          message="Try a different search or status."
          actionLabel="Clear filters"
          onAction={clearFilters}
        />
      ) : (
        <EmptyState
          art={<NoProjectsArt />}
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
              <ProjectCard project={project} />
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
    <div>
      <PageHeader
        title="Projects"
        actions={
          <Button leftIcon={Plus} onClick={() => navigate('/projects/new')}>
            New project
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          aria-label="Search projects"
          type="search"
          leadingIcon={Search}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by name"
          className="min-w-0 flex-1 sm:max-w-xs"
        />
        <Select
          aria-label="Filter by status"
          value={status}
          onChange={(event) => updateParams({ status: event.target.value, page: '' })}
          className="w-40"
        >
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </Select>
        <p aria-live="polite" className="text-sm text-fg-secondary sm:ml-auto">
          {data && !loading && !error ? `${data.total} ${data.total === 1 ? 'project' : 'projects'}` : ''}
        </p>
      </div>

      {renderContent()}
    </div>
  );
};

export default ProjectList;
