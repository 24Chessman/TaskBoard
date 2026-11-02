// CommentRow props: comment, name (the author's name, or "Deleted user"), canEdit (the author), canDelete (the author,
// the project owner or an admin), isEditing, editText, onEditText, editError, saving, onStartEdit(), onSave(event),
// onCancelEdit(), onDelete(), editRef (a ref on the inline edit form, used for the Esc handling in CommentSection).
// One compact comment: avatar, name, relative time (full date and time on hover), "(edited)", the text as plain text.
// The Edit and Delete icon buttons show on hover and on keyboard focus (focus-within), and are always visible on
// touch screens. While editing, the text turns into a small form with Save and Cancel.
import { Pencil, Trash2 } from 'lucide-react';
import { formatDateTime, timeAgo, wasEdited } from '../../../utils/dates.js';
import Avatar from '../../Avatar.jsx';
import Button from '../../Button.jsx';
import IconButton from '../../IconButton.jsx';
import Textarea from '../../Textarea.jsx';
import CommentCounter, { TEXT_MAX } from './CommentCounter.jsx';

const reveal = 'opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 [@media(hover:none)]:opacity-100';

const CommentRow = ({
  comment, name, canEdit, canDelete, isEditing, editText, onEditText, editError, saving, onStartEdit, onSave, onCancelEdit, onDelete, editRef,
}) => (
  <li className="group relative flex gap-3 px-3 py-2.5">
    <Avatar user={comment.author} />
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-sm font-medium text-fg">{name}</span>
        <time dateTime={comment.createdAt} title={formatDateTime(comment.createdAt)} className="text-xs text-fg-secondary">
          {timeAgo(comment.createdAt)}
        </time>
        {wasEdited(comment) && (
          <span className="text-xs text-fg-secondary" title={`Edited ${formatDateTime(comment.updatedAt)}`}>
            (edited)
          </span>
        )}
      </div>

      {isEditing ? (
        <form ref={editRef} onSubmit={onSave} noValidate className="mt-2 space-y-2">
          <div>
            <Textarea label="Edit comment" rows={3} value={editText} onChange={(event) => onEditText(event.target.value)} error={editError} />
            <CommentCounter length={editText.length} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" loading={saving} disabled={!editText.trim() || editText.length > TEXT_MAX}>
              Save
            </Button>
            <Button variant="secondary" onClick={onCancelEdit} disabled={saving}>
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <p className="mt-0.5 whitespace-pre-wrap break-words text-sm text-fg">{comment.text}</p>
      )}
    </div>

    {!isEditing && (canEdit || canDelete) && (
      <div className={`absolute right-2 top-1.5 flex gap-0.5 rounded-md bg-surface ${reveal}`}>
        {canEdit && <IconButton icon={Pencil} size="sm" label={`Edit comment by ${name}`} onClick={onStartEdit} />}
        {canDelete && <IconButton icon={Trash2} size="sm" label={`Delete comment by ${name}`} onClick={onDelete} />}
      </div>
    )}
  </li>
);

export default CommentRow;
