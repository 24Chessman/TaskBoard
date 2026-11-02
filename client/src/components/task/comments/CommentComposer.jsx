// CommentComposer props: draft, onDraft(text), error (shown under the box), posting, onSubmit(event), composerRef
// (a ref on the wrapper, so CommentSection can put the cursor back after posting). The box for a new comment: the
// current user's avatar, a textarea, a "Comment" button and the character counter (near the limit).
import Avatar from '../../Avatar.jsx';
import Button from '../../Button.jsx';
import Textarea from '../../Textarea.jsx';
import useAuth from '../../../hooks/useAuth.js';
import CommentCounter, { TEXT_MAX } from './CommentCounter.jsx';

const CommentComposer = ({ draft, onDraft, error, posting, onSubmit, composerRef }) => {
  const { user } = useAuth();

  return (
    <form onSubmit={onSubmit} noValidate className="flex gap-3">
      <Avatar user={user} />
      <div ref={composerRef} className="min-w-0 flex-1 space-y-2">
        <div>
          <Textarea aria-label="Add a comment" placeholder="Write a comment" rows={3} value={draft} onChange={(event) => onDraft(event.target.value)} error={error} />
          <CommentCounter length={draft.length} />
        </div>
        <Button type="submit" loading={posting} disabled={!draft.trim() || draft.length > TEXT_MAX}>
          Comment
        </Button>
      </div>
    </form>
  );
};

export default CommentComposer;
