// StatusSection props: project, refreshProject. Archive (with a confirmation) or reactivate the project (PATCH status).
import { useState } from 'react';
import { setProjectStatus } from '../../api/projects.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../Button.jsx';
import ConfirmDialog from '../ConfirmDialog.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import SettingsSection, { messageOf } from './SettingsSection.jsx';

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
    <SettingsSection
      title="Status"
      description={
        archived
          ? 'This project is archived. Reactivate it to make it active again.'
          : 'This project is active. Archive it when the work is finished.'
      }
    >
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
    </SettingsSection>
  );
};

export default StatusSection;
