// Toast props: toasts (array of { id, message, type }), onClose(id).
// Renders the stack of toasts: along the top on phones, bottom-right from the sm breakpoint. Used by
// ToastProvider; not meant to be used directly. Each toast is a white card with a coloured icon and the message;
// the type is also spoken ("Success:" / "Error:") so it never depends on colour. Fades in unless motion is reduced.
import { CheckCircle2, CircleAlert, X } from 'lucide-react';
import IconButton from './IconButton.jsx';

const kinds = {
  success: { icon: CheckCircle2, color: 'text-success', name: 'Success' },
  error: { icon: CircleAlert, color: 'text-danger', name: 'Error' },
};

const Toast = ({ toasts, onClose }) => (
  <div
    aria-live="polite"
    className="pointer-events-none fixed inset-x-4 top-4 z-50 flex flex-col gap-2 sm:inset-x-auto sm:bottom-4 sm:right-4 sm:top-auto sm:w-96"
  >
    {toasts.map((toast) => {
      const kind = kinds[toast.type] || kinds.success;
      const Icon = kind.icon;
      return (
        <div
          key={toast.id}
          className="pointer-events-auto flex animate-toast-in items-start gap-3 rounded-lg border border-line bg-surface p-3 text-sm text-fg shadow-lg"
        >
          <Icon size={18} aria-hidden="true" className={`mt-px shrink-0 ${kind.color}`} />
          <p className="min-w-0 flex-1 break-words">
            <span className="sr-only">{kind.name}: </span>
            {toast.message}
          </p>
          <IconButton icon={X} label="Close notification" size="sm" onClick={() => onClose(toast.id)} />
        </div>
      );
    })}
  </div>
);

export default Toast;
