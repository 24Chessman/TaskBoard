// EmptyState props: title, message (one helpful sentence, optional), actionLabel and onAction (the button shows
// only when both are given), icon (a lucide icon component shown in a soft circle, default Inbox).
import { Inbox } from 'lucide-react';
import Button from './Button.jsx';

const EmptyState = ({ title, message, actionLabel, onAction, icon: Icon = Inbox }) => (
  <div className="flex flex-col items-center px-4 py-10 text-center">
    <span
      aria-hidden="true"
      className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-fg-muted"
    >
      <Icon size={24} />
    </span>
    <h2 className="mt-4 text-base font-semibold text-fg">{title}</h2>
    {message && <p className="mt-1 max-w-sm text-sm text-fg-secondary">{message}</p>}
    {actionLabel && onAction && (
      <Button className="mt-4" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
  </div>
);

export default EmptyState;
