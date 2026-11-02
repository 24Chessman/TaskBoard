// Admin users page (/admin/users, only reachable for admins through AdminRoute).
// Lists all users, 10 per page, with an optional debounced search; search and page live in the URL query string.
// The table (components/admin/UsersTable.jsx) scrolls sideways on small screens. Each user has a change-role and a
// delete icon button; both ask for confirmation first. They are disabled on the admin's own row (the server
// refuses self-delete and removing the last admin anyway). Every refusal from the server is shown in a toast and
// in a message above the list, so a long one (for example "only owner of: <projects>") stays readable.
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { deleteUser, listUsers, setUserRole } from '../api/users.js';
import UsersTable from '../components/admin/UsersTable.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import PageHeader from '../components/shell/PageHeader.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useAuth from '../hooks/useAuth.js';
import useDebounce from '../hooks/useDebounce.js';
import useFetch from '../hooks/useFetch.js';

const PAGE_SIZE = 10;

const messageOf = (error) => error.response?.data?.message || 'Something went wrong. Please try again.';

const AdminUsers = () => {
  const { user: me } = useAuth();
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1);

  // The box keeps what was typed; the URL (and the request) follows after a short pause.
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
    () => listUsers({ search: search || undefined, page, limit: PAGE_SIZE }),
    [search, page]
  );

  const [pendingRole, setPendingRole] = useState(null); // { user, role }
  const [pendingDelete, setPendingDelete] = useState(null); // user
  const [busy, setBusy] = useState(false);
  const [actionError, setActionError] = useState('');

  const refuse = (requestError) => {
    const message = messageOf(requestError);
    setActionError(message);
    showToast(message, 'error');
  };

  const handleRoleChange = (user, role) => {
    if (role !== user.role) setPendingRole({ user, role });
  };

  const confirmRole = async () => {
    setBusy(true);
    setActionError('');
    try {
      await setUserRole(pendingRole.user._id, pendingRole.role);
      showToast(`${pendingRole.user.name} is now ${pendingRole.role === 'admin' ? 'an admin' : 'a regular user'}`, 'success');
      refetch();
    } catch (requestError) {
      refuse(requestError);
    } finally {
      setPendingRole(null);
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    setBusy(true);
    setActionError('');
    try {
      await deleteUser(pendingDelete._id);
      showToast(`${pendingDelete.name} deleted`, 'success');
      // If that was the only row on this page, go back one page
      if (data.data.length === 1 && page > 1) updateParams({ page: page - 1 === 1 ? '' : String(page - 1) });
      else refetch();
    } catch (requestError) {
      refuse(requestError);
    } finally {
      setPendingDelete(null);
      setBusy(false);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setSearchParams({});
  };

  const renderUsers = () => {
    if (loading && !data) return <Loader label="Loading users" />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;

    if (data.data.length === 0) {
      return (
        <EmptyState
          title="No users found"
          message={search ? 'No one matches that search.' : 'There are no users yet.'}
          actionLabel={search ? 'Clear search' : undefined}
          onAction={search ? clearSearch : undefined}
        />
      );
    }

    return (
      <>
        <UsersTable users={data.data} meId={me._id} onRoleChange={handleRoleChange} onDelete={setPendingDelete} />
        <div className="mt-4">
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
        breadcrumbs={[{ label: 'Admin', to: '/admin/users' }, { label: 'Users' }]}
        title="Users"
        description="Everyone who has an account. Change roles or remove accounts here."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Input
          aria-label="Search users"
          type="search"
          leadingIcon={Search}
          value={searchText}
          onChange={(event) => setSearchText(event.target.value)}
          placeholder="Search by name or email"
          className="min-w-0 flex-1 sm:max-w-xs"
        />
        <p aria-live="polite" className="text-sm text-fg-secondary sm:ml-auto">
          {data && !error ? `${data.total} ${data.total === 1 ? 'user' : 'users'}` : ''}
        </p>
      </div>

      {actionError && <div className="mb-4"><ErrorMessage message={actionError} /></div>}

      {renderUsers()}

      <ConfirmDialog
        isOpen={Boolean(pendingRole)}
        title="Change role?"
        message={
          pendingRole
            ? pendingRole.role === 'admin'
              ? `Make ${pendingRole.user.name} an admin?`
              : `Make ${pendingRole.user.name} a regular user?`
            : ''
        }
        confirmLabel="Change role"
        onConfirm={confirmRole}
        onCancel={() => setPendingRole(null)}
        loading={busy}
      />

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title={pendingDelete ? `Delete ${pendingDelete.name}?` : 'Delete user?'}
        message="They are removed from every project and unassigned from their tasks. Their comments and activity stay. This cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
        loading={busy}
      />
    </div>
  );
};

export default AdminUsers;
