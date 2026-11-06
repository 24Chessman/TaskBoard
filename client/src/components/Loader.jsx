// Loader props: label (the text shown under the spinner and read by screen readers, default "Loading"). A small
// centered spinner for inline loading (a list inside a page, a search result). Full pages use PageSkeleton instead.
const Loader = ({ label = 'Loading' }) => (
  <div role="status" className="flex flex-col items-center gap-2 py-8">
    <span
      aria-hidden="true"
      className="h-8 w-8 animate-spin rounded-full border-4 border-brand border-t-transparent motion-reduce:animate-none"
    />
    <span className="text-sm text-fg-secondary">{label}…</span>
  </div>
);

export default Loader;
