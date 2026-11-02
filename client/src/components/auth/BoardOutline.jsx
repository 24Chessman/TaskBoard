// BoardOutline props: className. A hand-drawn outline of a kanban board (three columns with a few cards, drawn
// with slightly uneven lines) used as a faint texture on the cobalt auth panel. White strokes only, no fill, no
// gradient. Decorative only: aria-hidden. The parent sets the opacity and position.
const BoardOutline = ({ className = '' }) => (
  <svg
    viewBox="0 0 520 420"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
    className={className}
  >
    <path d="M14 22c60-3 140 2 160-1 6 1 8 8 8 14v362c0 6-4 9-10 9-52 2-110-1-152 1-6-1-9-5-9-10V34c0-6 1-11 3-12z" />
    <path d="M200 20c50 2 110-2 152 0 6 1 9 6 9 12v368c0 6-5 9-11 9-48-2-104 2-146 0-6-1-9-5-9-10V32c0-6 2-11 5-12z" />
    <path d="M386 21c44-2 94 3 122 1 5 1 8 7 8 12v364c0 7-4 10-10 10-40 1-88-2-120 0-6-1-9-6-9-11V33c0-6 3-11 9-12z" />
    <path d="M32 58c40-2 90 1 124 0M32 58v52c0 4 3 6 6 6 36 1 80-2 114 0 4 0 4-3 4-6V58" />
    <path d="M32 140c38 1 86-2 124 0v58c0 4-3 6-7 6-36-1-78 1-112 0-4 0-5-3-5-7z" />
    <path d="M218 58c40-2 90 1 124 0v70c0 4-3 6-7 6-36 1-78-1-112 0-4 0-5-3-5-7z" />
    <path d="M218 150c40-1 86 1 124 0v54c0 4-3 6-7 6-36 0-78-1-112 0-4 0-5-3-5-7z" />
    <path d="M404 58c38-2 82 1 104 0v52c0 4-3 6-7 6-32 1-68-1-90 0-4 0-7-3-7-7z" />
    <path d="M46 78h60M46 94h38M232 78h72M232 94h44M232 170h56M418 78h50M418 94h30" />
  </svg>
);

export default BoardOutline;
