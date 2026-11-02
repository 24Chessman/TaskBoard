// CommentSection props: projectId, taskId, onDirtyChange (optional: called with true while a comment being written
// or edited has unsaved text, so the drawer can ask before closing). The comments of one task, shown in the task
// drawer as compact rows (CommentRow) with a composer (CommentComposer) under them.
//   list    oldest first; "Deleted user" for a deleted author; "(edited)" when changed more than a minute later.
//   add     textarea (max 1000) and a Comment button; after posting the cursor goes back into the box.
//   edit    only the author sees Edit: the comment turns into an inline textarea with Save and Cancel.
//   delete  the author, the project owner or an admin (useProject().isOwner includes admins), with a confirmation.
// Comment text is rendered as plain text. The list is kept in local state so adding, editing and deleting update it
// in place. Esc: the drawer and a confirm dialog both listen for Esc on the document, so while a delete
// confirmation is open (or the cursor is in the inline edit box) a capture listener on window handles Esc first and
// closes only that top layer; the drawer stays open. A 400 is shown under the box; any other error is a toast.
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createComment, deleteComment, listComments, updateComment } from '../../../api/comments.js';
import { useToast } from '../../../context/ToastContext.jsx';
import useAuth from '../../../hooks/useAuth.js';
import useFetch from '../../../hooks/useFetch.js';
import useProject from '../../../hooks/useProject.js';
import ConfirmDialog from '../../ConfirmDialog.jsx';
import ErrorMessage from '../../ErrorMessage.jsx';
import Loader from '../../Loader.jsx';
import { TEXT_MAX } from './CommentCounter.jsx';
import CommentComposer from './CommentComposer.jsx';
import CommentRow from './CommentRow.jsx';

const LIMIT = 100;

const validate = (text) => {
  if (!text.trim()) return 'Comment text is required';
  if (text.length > TEXT_MAX) return `Comment must be at most ${TEXT_MAX} characters`;
  return '';
};

const stopEvent = (event) => {
  event.stopPropagation();
  event.stopImmediatePropagation();
};

const CommentSection = ({ projectId, taskId, onDirtyChange }) => {
  const headingId = useId();
  const { user } = useAuth();
  const { isOwner } = useProject();
  const { showToast } = useToast();

  const { data, loading, error, refetch } = useFetch(() => listComments(projectId, taskId, { limit: LIMIT }), [projectId, taskId]);
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

  const composerRef = useRef(null);
  const editRef = useRef(null);

  // Tell the parent whether there is unsaved text (a draft, or an edit that differs from the saved comment)
  const editingOriginal = comments.find((comment) => comment._id === editingId)?.text;
  const dirty = Boolean(draft.trim()) || (editingId !== null && editText !== editingOriginal);
  useEffect(() => {
    onDirtyChange?.(dirty);
  }, [dirty, onDirtyChange]);
  useEffect(() => () => onDirtyChange?.(false), [onDirtyChange]);

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
  const fail = useCallback(
    (requestError, setFieldError) => {
      const body = requestError.response?.data;
      const message = body?.errors?.[0]?.message || body?.message || 'Something went wrong. Please try again.';
      if (requestError.response?.status === 400) setFieldError(message);
      else showToast(message, 'error');
    },
    [showToast]
  );

  const handlePost = async (event) => {
    event.preventDefault();
    const problem = validate(draft);
    setDraftError(problem);
    if (problem) return;

    setPosting(true);
    try {
      const created = await createComment(projectId, taskId, { text: draft.trim() });
      setComments((current) => [...current, created]);
      setDraft('');
      composerRef.current?.querySelector('textarea')?.focus();
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
    if (comments.length === 0) return <p className="text-sm text-fg-secondary">No comments yet. Start the conversation below.</p>;

    return (
      <ul className="divide-y divide-line rounded-lg border border-line">
        {comments.map((comment) => {
          const isAuthor = Boolean(comment.author) && comment.author._id === user._id;
          return (
            <CommentRow
              key={comment._id}
              comment={comment}
              name={comment.author ? comment.author.name : 'Deleted user'}
              canEdit={isAuthor}
              canDelete={isAuthor || isOwner}
              isEditing={editingId === comment._id}
              editText={editText}
              onEditText={setEditText}
              editError={editError}
              saving={saving}
              onStartEdit={() => startEdit(comment)}
              onSave={handleSave}
              onCancelEdit={() => setEditingId(null)}
              onDelete={() => setPendingDelete(comment)}
              editRef={editRef}
            />
          );
        })}
      </ul>
    );
  };

  return (
    <section aria-labelledby={headingId} className="space-y-3 border-t border-line pt-4">
      <h3 id={headingId} className="text-sm font-semibold text-fg">
        Comments{data && !error ? ` (${comments.length})` : ''}
      </h3>

      {renderList()}
      {data && data.total > data.data.length && (
        <p className="text-xs text-fg-secondary">
          Showing the oldest {data.data.length} of {data.total} comments.
        </p>
      )}

      <CommentComposer draft={draft} onDraft={setDraft} error={draftError} posting={posting} onSubmit={handlePost} composerRef={composerRef} />

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
