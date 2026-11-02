// CommentSection props: projectId, taskId, onDirtyChange (optional: called with true while a comment being written
// or edited has unsaved text, so the drawer can ask before closing). The comments of one task, shown inside the task modal (view mode).
//   list    oldest first in a scrollable area: avatar, author, relative time (full date and time on hover),
//           "(edited)" when changed more than a minute after posting. A deleted author shows as "Deleted user".
//   add     a labelled textarea (max 1000 with a counter) and a Post button.
//   edit    only the author sees Edit: the comment turns into an inline textarea with Save and Cancel.
//   delete  the author, the project owner or an admin (useProject().isOwner includes admins) get Delete + a confirmation.
// Comment text is rendered as plain text. The list is kept in local state so adding, editing and deleting update it
// in place. Esc: the task modal and a confirm dialog both listen for Esc on the document, so while a delete
// confirmation is open (or the cursor is in the inline edit box) a capture listener on window handles Esc first and
// closes only that top layer; the task modal stays open.
import { useEffect, useId, useRef, useState } from 'react';
import { createComment, deleteComment, listComments, updateComment } from '../api/comments.js';
import { useToast } from '../context/ToastContext.jsx';
import useAuth from '../hooks/useAuth.js';
import useFetch from '../hooks/useFetch.js';
import useProject from '../hooks/useProject.js';
import { formatDateTime, timeAgo, wasEdited } from '../utils/dates.js';
import Avatar from './Avatar.jsx';
import Button from './Button.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import EmptyState from './EmptyState.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import Loader from './Loader.jsx';
import Textarea from './Textarea.jsx';

const TEXT_MAX = 1000;
const LIMIT = 100;

const validate = (text) => {
  if (!text.trim()) return 'Comment text is required';
  if (text.length > TEXT_MAX) return `Comment must be at most ${TEXT_MAX} characters`;
  return '';
};

const Counter = ({ length }) => (
  <p className={`mt-1 text-right text-xs ${length > TEXT_MAX ? 'text-red-600' : 'text-slate-500'}`}>
    {length}/{TEXT_MAX}
  </p>
);

const stopEvent = (event) => {
  event.stopPropagation();
  event.stopImmediatePropagation();
};

const CommentSection = ({ projectId, taskId, onDirtyChange }) => {
  const headingId = useId();
  const { user } = useAuth();
  const { isOwner } = useProject();
  const { showToast } = useToast();

  const { data, loading, error, refetch } = useFetch(
    () => listComments(projectId, taskId, { limit: LIMIT }),
    [projectId, taskId]
  );
  const [comments, setComments] = useState([]);
  useEffect(() => {
    if (data) setComments(data.data);
  }, [data]);

  const [draft, setDraft] = useState('');
  const [draftError, setDraftError] = useState('');
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editError, setEditError] = useState('');
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const addRef = useRef(null);
  const editRef = useRef(null);
  const listRef = useRef(null);
  const scrollToEnd = useRef(false);

  // Tell the parent whether there is unsaved text (a draft, or an edit that differs from the saved comment)
  const editingOriginal = comments.find((comment) => comment._id === editingId)?.text;
  const dirty = Boolean(draft.trim()) || (editingId !== null && editText !== editingOriginal);
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);

  // After a new comment is added, scroll the list to it
  useEffect(() => {
    if (scrollToEnd.current && listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
      scrollToEnd.current = false;
    }
  }, [comments]);

  // Put the cursor in the inline edit box when editing starts
  useEffect(() => {
    if (editingId) editRef.current?.querySelector('textarea')?.focus();
  }, [editingId]);

  // Esc closes only the top layer (see the note at the top of the file)
  useEffect(() => {
    if (!pendingDelete && !editingId) return undefined;
    const handleKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      if (pendingDelete) {
        stopEvent(event);
        setPendingDelete(null);
      } else if (editRef.current?.contains(event.target)) {
        stopEvent(event);
        setEditingId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [pendingDelete, editingId]);

  // A 400 is a validation message for the field; any other refusal (403, 404, network) is a toast
  const fail = (requestError, setFieldError) => {
    const body = requestError.response?.data;
    const message = body?.errors?.[0]?.message || body?.message || 'Something went wrong. Please try again.';
    if (requestError.response?.status === 400) setFieldError(message);
    else showToast(message, 'error');
  };

  const handlePost = async (event) => {
    event.preventDefault();
    const problem = validate(draft);
    setDraftError(problem);
    if (problem) return;

    setPosting(true);
    try {
      const created = await createComment(projectId, taskId, { text: draft.trim() });
      scrollToEnd.current = true;
      setComments((current) => [...current, created]);
      setDraft('');
      addRef.current?.querySelector('textarea')?.focus();
    } catch (requestError) {
      fail(requestError, setDraftError);
    } finally {
      setPosting(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditText(comment.text);
    setEditError('');
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const problem = validate(editText);
    setEditError(problem);
    if (problem) return;

    setSaving(true);
    try {
      const updated = await updateComment(projectId, taskId, editingId, { text: editText.trim() });
      setComments((current) => current.map((comment) => (comment._id === updated._id ? updated : comment)));
      setEditingId(null);
      showToast('Comment updated', 'success');
    } catch (requestError) {
      fail(requestError, setEditError);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteComment(projectId, taskId, pendingDelete._id);
      setComments((current) => current.filter((comment) => comment._id !== pendingDelete._id));
      showToast('Comment deleted', 'success');
    } catch (requestError) {
      showToast(requestError.response?.data?.message || 'Could not delete the comment.', 'error');
    } finally {
      setPendingDelete(null);
      setDeleting(false);
    }
  };

  const renderList = () => {
    if (loading && !data) return <Loader label="Loading comments" />;
    if (error) return <ErrorMessage message={error} onRetry={refetch} />;
    if (comments.length === 0) {
      return <EmptyState title="No comments yet" message="Start the conversation below." />;
    }

    return (
      <ul ref={listRef} className="max-h-64 divide-y divide-slate-200 overflow-y-auto rounded-md border border-slate-200">
        {comments.map((comment) => {
          const name = comment.author ? comment.author.name : 'Deleted user';
          const isAuthor = Boolean(comment.author) && comment.author._id === user._id;
          const isEditing = editingId === comment._id;

          return (
            <li key={comment._id} className="flex gap-3 p-3">
              <Avatar user={comment.author} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="text-sm font-medium text-slate-900">{name}</span>
                  <time dateTime={comment.createdAt} title={formatDateTime(comment.createdAt)} className="text-xs text-slate-500">
                    {timeAgo(comment.createdAt)}
                  </time>
                  {wasEdited(comment) && (
                    <span className="text-xs text-slate-500" title={`Edited ${formatDateTime(comment.updatedAt)}`}>
                      (edited)
                    </span>
                  )}
                </div>

                {isEditing ? (
                  <form ref={editRef} onSubmit={handleSave} noValidate className="mt-2 space-y-2">
                    <div>
                      <Textarea
                        label="Edit comment"
                        rows={3}
                        value={editText}
                        onChange={(event) => setEditText(event.target.value)}
                        error={editError}
                      />
                      <Counter length={editText.length} />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" loading={saving} disabled={!editText.trim() || editText.length > TEXT_MAX}>
                        Save
                      </Button>
                      <Button variant="secondary" onClick={() => setEditingId(null)} disabled={saving}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="mt-1 whitespace-pre-wrap break-words text-sm text-slate-900">{comment.text}</p>
                    {(isAuthor || isOwner) && (
                      <div className="mt-1 flex gap-1">
                        {isAuthor && (
                          <Button variant="ghost" onClick={() => startEdit(comment)} aria-label={`Edit comment by ${name}`}>
                            Edit
                          </Button>
                        )}
                        <Button variant="ghost" onClick={() => setPendingDelete(comment)} aria-label={`Delete comment by ${name}`}>
                          Delete
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <section aria-labelledby={headingId} className="space-y-3 border-t border-slate-200 pt-4">
      <h3 id={headingId} className="text-sm font-semibold text-slate-900">
        Comments{data && !error ? ` (${comments.length})` : ''}
      </h3>

      {renderList()}
      {data && data.total > data.data.length && (
        <p className="text-xs text-slate-500">Showing the oldest {data.data.length} of {data.total} comments.</p>
      )}

      <form onSubmit={handlePost} noValidate className="space-y-2">
        <div ref={addRef}>
          <Textarea
            label="Add a comment"
            rows={3}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            error={draftError}
          />
          <Counter length={draft.length} />
        </div>
        <Button type="submit" loading={posting} disabled={!draft.trim() || draft.length > TEXT_MAX}>
          Post comment
        </Button>
      </form>

      <ConfirmDialog
        isOpen={Boolean(pendingDelete)}
        title="Delete comment?"
        message="This comment will be permanently deleted."
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={deleting}
      />
    </section>
  );
};

export default CommentSection;
