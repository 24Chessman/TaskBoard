// Toast props: toasts (array of { id, message, type }), onClose(id).
// Renders the stacked toast list at the top-right. Used by ToastProvider; not meant to be used directly.
const styles = {
  success: 'bg-emerald-600',
  error: 'bg-red-600',
};

const Toast = ({ toasts, onClose }) => (
  <div aria-live="polite" className="fixed right-4 top-4 z-50 flex w-80 max-w-full flex-col gap-2">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`flex items-start justify-between gap-2 rounded-md px-4 py-3 text-sm text-white shadow-lg ${styles[toast.type]}`}
      >
        <p>{toast.message}</p>
        <button
          type="button"
          aria-label="Close notification"
          className="rounded text-white hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          onClick={() => onClose(toast.id)}
        >
          &times;
        </button>
      </div>
    ))}
  </div>
);

export default Toast;
