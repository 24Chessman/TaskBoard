// ConfirmDialog props: isOpen, title, message, confirmLabel (default "Delete"),
// cancelLabel (default "Cancel"), onConfirm, onCancel, loading (disables buttons, spinner on confirm).
import Button from './Button.jsx';
import Modal from './Modal.jsx';

const ConfirmDialog = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onCancel} title={title}>
    <p className="text-sm text-slate-500">{message}</p>
    <div className="mt-6 flex justify-end gap-2">
      <Button variant="secondary" onClick={onCancel} disabled={loading}>
        {cancelLabel}
      </Button>
      <Button variant="danger" onClick={onConfirm} loading={loading}>
        {confirmLabel}
      </Button>
    </div>
  </Modal>
);

export default ConfirmDialog;
