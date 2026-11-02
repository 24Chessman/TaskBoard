// EmptyState props: title, message (one helpful sentence, optional), actionLabel and onAction (the button shows
// only when both are given), icon (a lucide icon component shown in a soft circle, default Inbox),
// art (optional: an aria-hidden SVG element from components/art/, shown instead of the icon circle),
// headingAs (optional: "h1" for a page that has no other h1, default "h2"), children (optional extra content under
// the message, for example a link).
import { Inbox } from 'lucide-react';
import Button from './Button.jsx';

const EmptyState = ({ title, message, actionLabel, onAction, icon: Icon = Inbox, art, headingAs: Heading = 'h2', children }) => (
  <div className="flex flex-col items-center px-4 py-10 text-center">
    {art || (
      <span
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-muted text-fg-muted"
      >
        <Icon size={24} />
      </span>
    )}
    <Heading className="mt-4 text-base font-semibold text-fg">{title}</Heading>
    {message && <p className="mt-1 max-w-sm text-sm text-fg-secondary">{message}</p>}
    {actionLabel && onAction && (
      <Button className="mt-4" onClick={onAction}>
        {actionLabel}
      </Button>
    )}
    {children}
  </div>
);

export default EmptyState;
