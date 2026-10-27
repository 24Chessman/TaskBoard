// Loader props: label (screen-reader text, default "Loading"). Shows a centered spinner.
const Loader = ({ label = 'Loading' }) => (
  <div role="status" className="flex justify-center py-8">
    <span
      aria-hidden="true"
      className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"
    />
    <span className="sr-only">{label}</span>
  </div>
);

export default Loader;
