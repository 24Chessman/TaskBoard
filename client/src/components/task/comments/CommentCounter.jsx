// CommentCounter props: length. The character counter under a comment box, in IBM Plex Mono (it is a counter), shown
// only when the text is near the 1000 character limit (800 or more) and in the danger colour once it is over.
export const TEXT_MAX = 1000;
const SHOW_FROM = 800;

const CommentCounter = ({ length }) =>
  length >= SHOW_FROM ? (
    <p className={`mt-1 text-right font-mono text-xs ${length > TEXT_MAX ? 'text-danger' : 'text-fg-secondary'}`}>
      {length}/{TEXT_MAX}
    </p>
  ) : null;

export default CommentCounter;
