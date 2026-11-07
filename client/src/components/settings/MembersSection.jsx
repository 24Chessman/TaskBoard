// MembersSection props: project, refreshProject. The member list (avatar, name, email, role badge, remove button
// with a confirmation; the only owner cannot be removed) and the AddMember search below it.
import { useState } from 'react';
import { UserMinus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { removeMember } from '../../api/projects.js';
import { useToast } from '../../context/ToastContext.jsx';
import useAuth from '../../hooks/useAuth.js';
import Avatar from '../Avatar.jsx';
import Badge from '../Badge.jsx';
import ConfirmDialog from '../ConfirmDialog.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import IconButton from '../IconButton.jsx';
import AddMember from './AddMember.jsx';
import SettingsSection, { messageOf } from './SettingsSection.jsx';

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
    <SettingsSection title="Members" description="People who can see and work on this project.">
      {error && <ErrorMessage message={error} />}

      <ul className="divide-y divide-line rounded-md border border-line">
        {members.map((member) => {
          const onlyOwner = member.role === 'owner' && ownerCount === 1;
          return (
            <li key={member.user._id} className="flex items-center justify-between gap-3 px-3 py-2">
              <div className="flex min-w-0 items-center gap-3">
                <Avatar user={member.user} size="md" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-fg">{member.user.name}</p>
                  <p className="truncate text-xs text-fg-secondary">{member.user.email}</p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Badge variant={member.role === 'owner' ? 'primary' : 'neutral'}>
                  {member.role === 'owner' ? 'Owner' : 'Member'}
                </Badge>
                <IconButton
                  icon={UserMinus}
                  label={`Remove ${member.user.name}`}
                  disabled={onlyOwner}
                  title={onlyOwner ? 'A project must keep at least one owner' : undefined}
                  onClick={() => setPendingRemove(member)}
                />
              </div>
            </li>
          );
        })}
      </ul>

      <AddMember project={project} refreshProject={refreshProject} onError={setError} />

      <ConfirmDialog
        isOpen={Boolean(pendingRemove)}
        title="Remove member?"
        message={`Remove ${pendingRemove?.user.name} from this project? Tasks they lead in this project will have no lead.`}
        confirmLabel="Remove"
        onConfirm={handleRemove}
        onCancel={() => setPendingRemove(null)}
        loading={removing}
      />
    </SettingsSection>
  );
};

export default MembersSection;
