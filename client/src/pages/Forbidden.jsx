// Forbidden page: shown when a signed-in user opens a page they may not use (403).
import { Link } from 'react-router-dom';
import { ForbiddenArt } from '../components/art/EmptyArt.jsx';
import EmptyState from '../components/EmptyState.jsx';

const Forbidden = () => (
  <EmptyState
    headingAs="h1"
    art={<ForbiddenArt />}
    title="You don't have access"
    message="Your account is not allowed to open this page."
  >
    <Link
      to="/projects"
      className="mt-4 rounded-md px-3 py-2 text-sm font-medium text-brand-fg hover:text-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring"
    >
      Back to Projects
    </Link>
  </EmptyState>
);

export default Forbidden;
