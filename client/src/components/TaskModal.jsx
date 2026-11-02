// TaskModal props: modal ({ mode: 'create', status } where status is optional: the column the task was started
// from), project (with members populated), onClose(), onChanged() (the board refetches).
// The compact modal for CREATING a task (built on the shared Modal). Viewing and editing a task happens in
// components/task/TaskDrawer.jsx. The server enforces the permissions: anyone in the project can create tasks.
import Modal from './Modal.jsx';
import TaskForm from './task/TaskForm.jsx';

const TaskModal = ({ modal, project, onClose, onChanged }) => (
  <Modal isOpen onClose={onClose} title="New task">
    <TaskForm
      project={project}
      defaultStatus={modal.status}
      onCancel={onClose}
      onSaved={() => {
        onChanged();
        onClose();
      }}
    />
  </Modal>
);

export default TaskModal;
