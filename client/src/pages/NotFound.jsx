// NotFound page: shown for any address that matches no route (404). Works for guests and signed-in users.
import { Link } from 'react-router-dom';
import { NotFoundArt } from '../components/art/EmptyArt.jsx';
import EmptyState from '../components/EmptyState.jsx';
import useAuth from '../hooks/useAuth.js';

const NotFound = () => {
  const { user } = useAuth();

  return (
    <EmptyState
      headingAs="h1"
      art={<NotFoundArt />}
      title="We can't find that page"
      message="The address may be mistyped, or the page may have moved."
    >
      <Link
        to={user ? '/projects' : '/'}
        className="mt-4 inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-medium text-brand-fg hover:text-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring"
      >
        {user ? 'Back to Projects' : 'Back to home'}
      </Link>
    </EmptyState>
  );
};

export default NotFound;
