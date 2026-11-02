// DangerSection props: project. Delete the project after a confirmation, then go back to the project list.
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteProject } from '../../api/projects.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../Button.jsx';
import ConfirmDialog from '../ConfirmDialog.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import SettingsSection, { messageOf } from './SettingsSection.jsx';

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
    <SettingsSection
      danger
      title="Danger zone"
      description="Deleting a project also deletes its tasks, comments and activity. This cannot be undone."
    >
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
    </SettingsSection>
  );
};

export default DangerSection;
