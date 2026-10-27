// EmptyState props: title, message, actionLabel and onAction (the button shows only when both are given).
import Button from './Button.jsx';

const EmptyState = ({ title, message, actionLabel, onAction }) => (
  <div className="py-12 text-center">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    {message && <p className="mt-1 text-sm text-slate-500">{message}</p>}
    {actionLabel && onAction && (
      <Button className="mt-4" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
