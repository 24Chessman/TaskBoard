// Admin users page (/admin/users, only reachable for admins through AdminRoute).
// Lists all users, 10 per page, with an optional debounced search; search and page live in the URL query string.
// Desktop (md and up) shows a table, small screens show stacked cards. Each user has a role Select and a Delete
// button; both ask for confirmation first. They are disabled on the admin's own row (the server refuses
// self-delete and removing the last admin anyway). Every refusal from the server is shown in a toast and in a
// message above the list, so a long one (for example "only owner of: <projects>") stays readable.
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { deleteUser, listUsers, setUserRole } from '../api/users.js';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import EmptyState from '../components/EmptyState.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Pagination from '../components/Pagination.jsx';
import Select from '../components/Select.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useAuth from '../hooks/useAuth.js';
import useDebounce from '../hooks/useDebounce.js';
import useFetch from '../hooks/useFetch.js';
import { formatDate, localDateKey } from '../utils/dates.js';

const PAGE_SIZE = 10;

const messageOf = (error) => error.response?.data?.message || 'Something went wrong. Please try again.';
const joined = (user) => formatDate(localDateKey(new Date(user.createdAt)));
const RoleBadge = ({ role }) => (
  <Badge variant={role === 'admin' ? 'primary' : 'neutral'}>{role === 'admin' ? 'Admin' : 'User'}</Badge>
);

// The role Select and Delete button of one user. isSelf disables both.
const RowActions = ({ user, isSelf, onRoleChange, onDelete }) => (
  <div className="flex items-center gap-2">
    <Select
      aria-label={`Role for ${user.name}`}
      value={user.role}
      disabled={isSelf}
      onChange={(event) => onRoleChange(user, event.target.value)}
      className="w-28"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </Select>
    <Button variant="danger" disabled={isSelf} onClick={() => onDelete(user)} aria-label={`Delete ${user.name}`}>
      Delete
    </Button>
  </div>
);

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
        <div className="hidden overflow-x-auto rounded-lg border border-slate-200 bg-white md:block">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th scope="col" className="px-4 py-3 font-medium">Name</th>
                <th scope="col" className="px-4 py-3 font-medium">Email</th>
                <th scope="col" className="px-4 py-3 font-medium">Role</th>
                <th scope="col" className="px-4 py-3 font-medium">Joined</th>
                <th scope="col" className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {data.data.map((user) => (
                <tr key={user._id}>
                  <th scope="row" className="px-4 py-3 text-left font-medium text-slate-900">
                    {user.name}
                    {user._id === me._id && <span className="ml-1 font-normal text-slate-500">(you)</span>}
                  </th>
                  <td className="px-4 py-3 text-slate-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3 text-slate-500">{joined(user)}</td>
                  <td className="px-4 py-3">
                    <RowActions user={user} isSelf={user._id === me._id} onRoleChange={handleRoleChange} onDelete={setPendingDelete} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ul className="space-y-3 md:hidden">
          {data.data.map((user) => (
            <li key={user._id}>
              <Card className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="break-words font-medium text-slate-900">
                      {user.name}
                      {user._id === me._id && <span className="ml-1 font-normal text-slate-500">(you)</span>}
                    </p>
                    <p className="break-all text-sm text-slate-500">{user.email}</p>
                  </div>
                  <RoleBadge role={user.role} />
                </div>
                <p className="text-xs text-slate-500">Joined {joined(user)}</p>
                <RowActions user={user} isSelf={user._id === me._id} onRoleChange={handleRoleChange} onDelete={setPendingDelete} />
              </Card>
            </li>
          ))}
        </ul>

        <Pagination
          page={data.page}
          totalPages={Math.ceil(data.total / data.limit)}
          onPageChange={(next) => updateParams({ page: next === 1 ? '' : String(next) })}
        />
      </>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Users</h1>

      <Input
        label="Search users"
        type="search"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Name or email (optional)"
        className="max-w-md"
      />

      {actionError && <ErrorMessage message={actionError} />}

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
