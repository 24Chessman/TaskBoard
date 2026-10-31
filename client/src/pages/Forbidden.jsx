// Forbidden page: shown when a signed-in user opens a page they may not use (403).
import { Link } from 'react-router-dom';

const Forbidden = () => (
  <section className="py-16 text-center">
    <h1 className="text-2xl font-semibold text-slate-900">You don't have access</h1>
    <p className="mt-2 text-sm text-slate-500">Your account is not allowed to open this page.</p>
    <Link
      to="/projects"
      className="mt-6 inline-block rounded-md px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
    >
      Back to Projects
    </Link>
  </section>
);

export default Forbidden;
