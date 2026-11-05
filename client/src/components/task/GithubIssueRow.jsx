// GithubIssueRow props: issue ({ url, title, state }; title and state can be missing), action (optional node at the end of
// the row, for example a Remove button), showUrl (optional: also print the link under the title).
// One linked GitHub issue or pull request: a state lozenge (Open in the success role, Closed in the neutral role, always icon
// and text; a merged pull request is "closed" for the API, so it shows Closed), the title on one line with the full text
// as a tooltip, and, only when the stored url is a real github.com link (safeGithubHref), a link that opens in a new tab.
// A url that is not safe (for example javascript:) is never made a link: the title shows as plain text.
import { CircleCheck, CircleDot, ExternalLink } from 'lucide-react';
import { safeGithubHref } from '../../utils/githubUrl.js';
import Badge from '../Badge.jsx';

const STATES = {
  open: { label: 'Open', variant: 'success', icon: CircleDot },
  closed: { label: 'Closed', variant: 'neutral', icon: CircleCheck },
};

const GithubIssueRow = ({ issue, action, showUrl = false }) => {
  const href = safeGithubHref(issue.url);
  const title = issue.title || issue.url;
  const state = STATES[issue.state];

  return (
    <div className="w-full min-w-0">
      <div className="flex min-w-0 items-center gap-2">
        {state && (
          <Badge variant={state.variant} icon={state.icon} className="shrink-0">
            {state.label}
          </Badge>
        )}
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            title={title}
            aria-label={`Open GitHub issue: ${title} (opens in a new tab)`}
            className="inline-flex min-w-0 items-center gap-1 rounded text-sm font-medium text-brand-fg hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring"
          >
            <span className="truncate">{title}</span>
            <ExternalLink size={14} aria-hidden="true" className="shrink-0" />
          </a>
        ) : (
          <span title={title} className="min-w-0 truncate text-sm text-fg">
            {title}
          </span>
        )}
        {action && <span className="ml-auto shrink-0">{action}</span>}
      </div>
      {showUrl && href && <p className="mt-1 truncate text-xs text-fg-secondary">{href}</p>}
    </div>
  );
};

export default GithubIssueRow;
