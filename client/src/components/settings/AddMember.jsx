// AddMember props: project, refreshProject, onError (called with a message, or '' to clear it). Search users by
// name or email (2+ characters, debounced), and add one who is not yet a member.
import { useState } from 'react';
import { Search } from 'lucide-react';
import { addMember } from '../../api/projects.js';
import { searchUsers } from '../../api/users.js';
import { useToast } from '../../context/ToastContext.jsx';
import useDebounce from '../../hooks/useDebounce.js';
import useFetch from '../../hooks/useFetch.js';
import Avatar from '../Avatar.jsx';
import Button from '../Button.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import Input from '../Input.jsx';
import Loader from '../Loader.jsx';
import { messageOf } from './SettingsSection.jsx';

const MIN_SEARCH_LENGTH = 2;

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
    if (!canSearch) return <p className="text-sm text-fg-secondary">Type at least {MIN_SEARCH_LENGTH} characters to search.</p>;
    if (loading) return <Loader label="Searching users" />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (results.length === 0) {
      return <p className="text-sm text-fg-secondary">No users found, or they are already members.</p>;
    }
    return (
      <ul className="divide-y divide-line rounded-md border border-line">
        {results.map((found) => (
          <li key={found._id} className="flex items-center justify-between gap-3 px-3 py-2">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar user={found} size="md" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-fg">{found.name}</p>
                <p className="truncate text-xs text-fg-secondary">{found.email}</p>
              </div>
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
        leadingIcon={Search}
        value={searchText}
        onChange={(event) => setSearchText(event.target.value)}
        placeholder="Search users by name or email"
      />
      {renderResults()}
    </div>
  );
};

export default AddMember;
