// Project settings page (/projects/:projectId/settings). Owners and global admins only: anyone else sees the
// Forbidden page, even when opening the URL directly. Four sections, each its own small component below:
//   DetailsSection  edit name and description (PUT)
//   StatusSection   archive (with confirmation) or reactivate (PATCH status)
//   MembersSection  list members, remove with confirmation, add members found by searching users
//   DangerSection   delete the project with confirmation
// The project comes from useProject(); after every change refreshProject() reloads it.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  addMember,
  deleteProject,
  removeMember,
  setProjectStatus,
  updateProject,
} from '../api/projects.js';
import { searchUsers } from '../api/users.js';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import Loader from '../components/Loader.jsx';
import Textarea from '../components/Textarea.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useAuth from '../hooks/useAuth.js';
import useDebounce from '../hooks/useDebounce.js';
import useFetch from '../hooks/useFetch.js';
import useProject from '../hooks/useProject.js';
import Forbidden from './Forbidden.jsx';

const DESCRIPTION_MAX = 500;
const MIN_SEARCH_LENGTH = 2;

const messageOf = (error) =>
  error.response?.data?.errors?.[0]?.message ||
  error.response?.data?.message ||
  'Something went wrong. Please try again.';

const SectionTitle = ({ children }) => <h2 className="text-lg font-semibold text-slate-900">{children}</h2>;

const validateDetails = ({ name, description }) => {
  const errors = {};
  const trimmed = name.trim();
  if (!trimmed) errors.name = 'Name is required';
  else if (trimmed.length < 3 || trimmed.length > 80) errors.name = 'Name must be 3 to 80 characters';
  if (description.length > DESCRIPTION_MAX) errors.description = `Description must be at most ${DESCRIPTION_MAX} characters`;
  return errors;
};

const DetailsSection = ({ project, refreshProject }) => {
  const { showToast } = useToast();
  const [values, setValues] = useState({ name: project.name, description: project.description || '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateDetails(values);
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await updateProject(project._id, { name: values.name.trim(), description: values.description });
      showToast('Project updated', 'success');
      refreshProject();
    } catch (error) {
      const list = error.response?.data?.errors;
      if (Array.isArray(list) && list.length > 0) {
        const mapped = {};
        list.forEach(({ field, message }) => {
          mapped[field] = message;
        });
        setFieldErrors(mapped);
      } else {
        setFormError(messageOf(error));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <Card className="space-y-4 p-6">
      <SectionTitle>Details</SectionTitle>
      <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
        {formError && <ErrorMessage message={formError} />}
        <Input label="Name" name="name" autoComplete="off" value={values.name} onChange={handleChange} error={fieldErrors.name} />
        <div>
          <Textarea
            label="Description"
            name="description"
            rows={4}
            value={values.description}
            onChange={handleChange}
            error={fieldErrors.description}
          />
          <p className={`mt-1 text-right text-xs ${values.description.length > DESCRIPTION_MAX ? 'text-red-600' : 'text-slate-500'}`}>
            {values.description.length}/{DESCRIPTION_MAX}
          </p>
        </div>
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </form>
    </Card>
    </section>
  );
};

const StatusSection = ({ project, refreshProject }) => {
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const archived = project.status === 'archived';

  const changeStatus = async (status) => {
    setLoading(true);
    setError('');
    try {
      await setProjectStatus(project._id, status);
      showToast(status === 'archived' ? 'Project archived' : 'Project reactivated', 'success');
      setConfirmOpen(false);
      refreshProject();
    } catch (requestError) {
      setError(messageOf(requestError));
      setConfirmOpen(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Card className="space-y-4 p-6">
      <SectionTitle>Status</SectionTitle>
      <p className="text-sm text-slate-500">
        {archived
          ? 'This project is archived. Reactivate it to make it active again.'
          : 'This project is active. Archive it when the work is finished.'}
      </p>
      {error && <ErrorMessage message={error} />}
      {archived ? (
        <Button variant="secondary" loading={loading} onClick={() => changeStatus('active')}>
          Reactivate project
        </Button>
      ) : (
        <Button variant="secondary" onClick={() => setConfirmOpen(true)}>
          Archive project
        </Button>
      )}
      <ConfirmDialog
        isOpen={confirmOpen}
        title="Archive project?"
        message="Archived projects stay readable and can be reactivated at any time."
        confirmLabel="Archive"
        onConfirm={() => changeStatus('archived')}
        onCancel={() => setConfirmOpen(false)}
        loading={loading}
      />
    </Card>
    </section>
  );
};

const AddMember = ({ project, refreshProject, onError }) => {
  const { showToast } = useToast();
  const [searchText, setSearchText] = useState('');
  const [addingId, setAddingId] = useState(null);
  const search = useDebounce(searchText).trim();
  const canSearch = search.length >= MIN_SEARCH_LENGTH;

  const { data, loading, error, refetch } = useFetch(
    () => (canSearch ? searchUsers(search) : Promise.resolve(null)),
    [search]
  );

  const memberIds = new Set(project.members.map((member) => member.user?._id));
  const results = data ? data.data.filter((found) => !memberIds.has(found._id)) : [];

  const handleAdd = async (found) => {
    setAddingId(found._id);
    onError('');
    try {
      await addMember(project._id, found._id);
      showToast(`${found.name} added to the project`, 'success');
      refreshProject();
    } catch (requestError) {
      onError(messageOf(requestError));
    } finally {
      setAddingId(null);
    }
  };

  const renderResults = () => {
    if (!canSearch) return <p className="text-sm text-slate-500">Type at least {MIN_SEARCH_LENGTH} characters to search.</p>;
    if (loading) return <Loader label="Searching users" />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (results.length === 0) {
      return <p className="text-sm text-slate-500">No users found, or they are already members.</p>;
    }
    return (
      <ul className="divide-y divide-slate-200 rounded-md border border-slate-200">
        {results.map((found) => (
          <li key={found._id} className="flex items-center justify-between gap-3 px-3 py-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-900">{found.name}</p>
              <p className="truncate text-xs text-slate-500">{found.email}</p>
            </div>
            <Button
              variant="secondary"
              loading={addingId === found._id}
              disabled={addingId !== null}
              onClick={() => handleAdd(found)}
              aria-label={`Add ${found.name}`}
            >
              Add
            </Button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="space-y-3">
      <Input
        label="Add a member"
        type="search"
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search users by name or email"
        className="max-w-md"
      />
      {renderResults()}
    </div>
  );
};

const MembersSection = ({ project, refreshProject }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [pendingRemove, setPendingRemove] = useState(null);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');

  const members = project.members.filter((member) => member.user);
  const ownerCount = members.filter((member) => member.role === 'owner').length;

  const handleRemove = async () => {
    const { user: removed } = pendingRemove;
    setRemoving(true);
    setError('');
    try {
      await removeMember(project._id, removed._id);
      showToast(`${removed.name} removed from the project`, 'success');
      setPendingRemove(null);
      // Someone who removes themselves can no longer open this project
      if (removed._id === user._id) navigate('/projects');
      else refreshProject();
    } catch (requestError) {
      setError(messageOf(requestError));
      setPendingRemove(null);
    } finally {
      setRemoving(false);
    }
  };

  return (
    <section>
      <Card className="space-y-4 p-6">
      <SectionTitle>Members</SectionTitle>
      {error && <ErrorMessage message={error} />}

      <ul className="divide-y divide-slate-200 rounded-md border border-slate-200">
        {members.map((member) => {
          const onlyOwner = member.role === 'owner' && ownerCount === 1;
          return (
            <li key={member.user._id} className="flex flex-wrap items-center justify-between gap-3 px-3 py-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-slate-900">{member.user.name}</p>
                <p className="truncate text-xs text-slate-500">{member.user.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={member.role === 'owner' ? 'primary' : 'neutral'}>
                  {member.role === 'owner' ? 'Owner' : 'Member'}
                </Badge>
                <Button
                  variant="ghost"
                  disabled={onlyOwner}
                  title={onlyOwner ? 'A project must keep at least one owner' : undefined}
                  onClick={() => setPendingRemove(member)}
                  aria-label={`Remove ${member.user.name}`}
                >
                  Remove
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <AddMember project={project} refreshProject={refreshProject} onError={setError} />

      <ConfirmDialog
        isOpen={Boolean(pendingRemove)}
        title="Remove member?"
        message={`Remove ${pendingRemove?.user.name} from this project? Tasks assigned to them in this project become unassigned.`}
        confirmLabel="Remove"
        onConfirm={handleRemove}
        onCancel={() => setPendingRemove(null)}
        loading={removing}
      />
    </Card>
    </section>
  );
};

const DangerSection = ({ project }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await deleteProject(project._id);
      showToast('Project deleted', 'success');
      navigate('/projects');
    } catch (requestError) {
      setError(messageOf(requestError));
      setConfirmOpen(false);
      setDeleting(false);
    }
  };

  return (
    <section>
      <Card className="space-y-4 p-6">
      <h2 className="text-lg font-semibold text-red-600">Danger zone</h2>
      <p className="text-sm text-slate-500">
        Deleting a project also deletes its tasks, comments and activity. This cannot be undone.
      </p>
      {error && <ErrorMessage message={error} />}
      <Button variant="danger" onClick={() => setConfirmOpen(true)}>
        Delete project
      </Button>
      <ConfirmDialog
        isOpen={confirmOpen}
        title={`Delete "${project.name}"?`}
        message="All tasks, comments and activity in this project will be permanently deleted."
        confirmLabel="Delete project"
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </Card>
    </section>
  );
};

const ProjectSettings = () => {
  const { project, isOwner, refreshProject } = useProject();

  if (!isOwner) return <Forbidden />;

  return (
    <div className="space-y-6">
      <DetailsSection project={project} refreshProject={refreshProject} />
      <StatusSection project={project} refreshProject={refreshProject} />
      <MembersSection project={project} refreshProject={refreshProject} />
      <DangerSection project={project} />
    </div>
  );
};

export default ProjectSettings;
