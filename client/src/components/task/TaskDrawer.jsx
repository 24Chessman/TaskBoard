// TaskDrawer props: taskId, tasks (the board's current task list: the drawer shows the live copy of its task, so it
// updates after every refetch), project (with members populated), isOwner (project owner or admin), onClose(),
// onChanged() (the board refetches). Opens a task in a right-hand Drawer (full width on phones):
//   view  left pane: large title, description and the comments; right pane: Details (status saves at once)
//   edit  the same drawer shows the task form (all fields, full-replace PUT)
// Edit is for the owner/admin, the creator and the assignee; Delete (in the "More" menu, with a confirmation) is for
// the owner/admin and the creator. The server enforces the same rules.
// Closing (Esc, overlay, the X button) asks "Discard changes?" first when the form or a comment has unsaved text.
// Esc closes only the top layer: a dialog, the More menu, a comment box, then the drawer (utils/layers.js).
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { deleteTask } from '../../api/tasks.js';
import { useToast } from '../../context/ToastContext.jsx';
import useAuth from '../../hooks/useAuth.js';
import Button from '../Button.jsx';
import CommentSection from './comments/CommentSection.jsx';
import ConfirmDialog from '../ConfirmDialog.jsx';
import Drawer from '../Drawer.jsx';
import Dropdown from '../Dropdown.jsx';
import { shouldConfirmDiscard } from './dirty.js';
import TaskDetailsPane from './TaskDetailsPane.jsx';
import TaskForm from './TaskForm.jsx';
import { messageOf } from './taskConstants.js';

const TaskDrawer = ({ taskId, tasks, project, isOwner, onClose, onChanged }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [formDirty, setFormDirty] = useState(false);
  const [commentDirty, setCommentDirty] = useState(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const task = tasks.find((item) => item._id === taskId);

  // The task can vanish after a refetch (for example it was deleted by someone else): close then
  useEffect(() => {
    if (!task) onClose();
  }, [task, onClose]);

  const onFormDirty = useCallback((value) => setFormDirty(value), []);
  const onCommentDirty = useCallback((value) => setCommentDirty(value), []);

  if (!task) return null;

  const isCreator = Boolean(task.createdBy) && task.createdBy._id === user._id;
  const isAssignee = Boolean(task.assignee) && task.assignee._id === user._id;
  const canEdit = isOwner || isCreator || isAssignee;
  const canDelete = isOwner || isCreator;

  const requestClose = () => (shouldConfirmDiscard({ formDirty, commentDirty }) ? setConfirmDiscard(true) : onClose());

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(project._id, task._id);
      showToast('Task deleted', 'success');
      onChanged();
      onClose();
    } catch (error) {
      showToast(messageOf(error), 'error');
      setConfirmDelete(false);
      setDeleting(false);
    }
  };

  return (
    <>
      <Drawer isOpen onClose={requestClose} title={editing ? 'Edit task' : 'Task details'} size="lg">
        {editing ? (
          <TaskForm
            project={project}
            task={task}
            onDirtyChange={onFormDirty}
            onCancel={() => setEditing(false)}
            onSaved={() => {
              onChanged();
              setEditing(false);
            }}
          />
        ) : (
          <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_15rem]">
            <div className="min-w-0 space-y-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="min-w-0 break-words text-xl font-semibold text-fg">{task.title}</h3>
                <div className="flex shrink-0 items-center gap-1">
                  {canEdit && (
                    <Button variant="secondary" leftIcon={Pencil} onClick={() => setEditing(true)}>
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Dropdown
                      label="More actions"
                      triggerContent={<MoreHorizontal size={16} aria-hidden="true" />}
                      triggerClassName="inline-flex h-10 w-10 items-center justify-center rounded-md text-fg-secondary hover:bg-surface-muted sm:h-8 sm:w-8"
                      items={[{ label: 'Delete task', icon: Trash2, danger: true, onSelect: () => setConfirmDelete(true) }]}
                    />
                  )}
                </div>
              </div>
              <p className="whitespace-pre-wrap break-words text-sm text-fg">
                {task.description || <span className="text-fg-secondary">No description</span>}
              </p>
              <CommentSection projectId={project._id} taskId={task._id} onDirtyChange={onCommentDirty} />
            </div>
            <TaskDetailsPane task={task} project={project} onChanged={onChanged} />
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        isOpen={confirmDelete}
        title="Delete task?"
        message={`"${task.title}" and its comments will be permanently deleted.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
        loading={deleting}
      />
      <ConfirmDialog
        isOpen={confirmDiscard}
        title="Discard changes?"
        message="You have unsaved text. If you close now it will be lost."
        confirmLabel="Discard"
        onConfirm={() => {
          setConfirmDiscard(false);
          onClose();
        }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </>
  );
};

export default TaskDrawer;
