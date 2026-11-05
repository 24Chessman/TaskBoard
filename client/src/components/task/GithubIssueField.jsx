// GithubIssueField props: value (the task's current githubIssue { url, title, state } or null), error (a message from the
// form: "look up first" or a server refusal), onChange({ issue, text }) (called whenever the linked issue or the typed
// text changes; text is a URL that was typed but not looked up yet), inputRef (a ref the form uses to focus the field).
// A GitHub issue (optional) field with a "Look up" button: paste an issue or pull request link, press Enter or the button,
// and the server (GET /github/issue) returns its title and state. The preview row that replaces the input is what the
// form saves; Remove clears it. States: idle, loading (live region, spinner, aria-busy), success, error (under the field).
// Enter never submits the task form. The typed link stays in the box after an error so it can be fixed.
import { Link2 } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { lookupIssue } from '../../api/github.js';
import { isGithubIssueUrl } from '../../utils/githubUrl.js';
import Button from '../Button.jsx';
import { FieldLabel } from '../FieldParts.jsx';
import Input from '../Input.jsx';
import GithubIssueRow from './GithubIssueRow.jsx';

const MESSAGES = {
  400: 'Enter a valid GitHub issue or pull request link',
  404: 'GitHub could not find that issue (it may be private or the number is wrong)',
  429: 'GitHub rate limit reached, try again in a few minutes',
  other: 'Could not reach GitHub, try again',
};
const messageFor = (error) => MESSAGES[error.response?.status] || MESSAGES.other;

const GithubIssueField = ({ value, error, onChange, inputRef }) => {
  const inputId = useId();
  const [issue, setIssue] = useState(value || null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [announcement, setAnnouncement] = useState('');
  const removeRef = useRef(null);
  const focusTarget = useRef(null); // 'remove' after a lookup, 'input' after Remove

  useEffect(() => {
    onChange({ issue, text });
  }, [issue, text, onChange]);

  useEffect(() => {
    if (focusTarget.current === 'remove') removeRef.current?.querySelector('button')?.focus();
    if (focusTarget.current === 'input') inputRef?.current?.querySelector('input')?.focus();
    focusTarget.current = null;
  }, [issue, inputRef]);

  const lookup = async () => {
    const url = text.trim();
    if (!url || loading) return;
    if (!isGithubIssueUrl(url)) {
      setLookupError(MESSAGES[400]);
      setAnnouncement(MESSAGES[400]);
      return;
    }
    setLoading(true);
    setLookupError('');
    setAnnouncement('Looking up the GitHub issue…');
    try {
      const found = await lookupIssue(url);
      focusTarget.current = 'remove';
      setIssue(found);
      setText('');
      setAnnouncement(`GitHub issue found: ${found.title}`);
    } catch (requestError) {
      const message = messageFor(requestError);
      setLookupError(message);
      setAnnouncement(message);
    } finally {
      setLoading(false);
    }
  };

  const remove = () => {
    focusTarget.current = 'input';
    setIssue(null);
    setAnnouncement('GitHub issue link removed');
  };

  return (
    <div ref={inputRef}>
      {issue ? (
        <p className="mb-1 block text-sm font-medium text-fg">GitHub issue (optional)</p>
      ) : (
        <FieldLabel htmlFor={inputId}>GitHub issue (optional)</FieldLabel>
      )}

      {issue ? (
        <div ref={removeRef} className="rounded-md border border-line bg-surface p-2.5">
          <GithubIssueRow
            issue={issue}
            showUrl
            action={
              <Button variant="ghost" size="sm" aria-label="Remove GitHub issue link" onClick={remove}>
                Remove
              </Button>
            }
          />
          {error && <p className="mt-2 text-sm text-danger-fg">{error}</p>}
        </div>
      ) : (
        <>
          <p className="mb-1 text-xs text-fg-secondary">Paste an issue or pull request link from github.com</p>
          <div className="flex items-start gap-2">
            <Input
              id={inputId}
              type="url"
              inputMode="url"
              autoComplete="off"
              leadingIcon={Link2}
              placeholder="https://github.com/owner/repo/issues/1"
              value={text}
              error={error || lookupError}
              onChange={(event) => {
                setText(event.target.value);
                setLookupError('');
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault(); // Enter must not submit the task form
                  lookup();
                }
              }}
              className="min-w-0 flex-1"
            />
            <Button variant="secondary" size="sm" loading={loading} aria-busy={loading} disabled={!text.trim()} onClick={lookup} className="mt-0.5 shrink-0">
              Look up
            </Button>
          </div>
        </>
      )}
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
};

export default GithubIssueField;
