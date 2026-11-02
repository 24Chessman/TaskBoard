// AuthLayout props: children (the page's heading and form). The split layout of the Login and Register pages.
// Desktop (lg and up): a left solid cobalt brand panel with the white Logo, one short tagline and a faint hand-drawn board outline
// as texture (no gradient), the form on the right.
// Phones and tablets: only the form, with the Logo above it. The Logo always links to "/", and a "Back to home"
// link sits at the top of the form side. The page's own <h1> comes from the page.
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo.jsx';
import BoardOutline from './BoardOutline.jsx';

const linkRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2';

const AuthLayout = ({ children }) => (
  <div className="flex min-h-screen bg-surface font-sans text-fg">
    <aside className="relative hidden w-5/12 max-w-xl shrink-0 flex-col justify-between overflow-hidden bg-brand p-10 lg:flex">
      <BoardOutline className="pointer-events-none absolute -right-16 top-1/4 w-[34rem] max-w-none opacity-15" />
      <Link
        to="/"
        aria-label="TaskBoard home"
        className="relative w-fit rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
      >
        <Logo tone="light" size={32} />
      </Link>
      <p className="relative max-w-sm text-3xl font-semibold tracking-tight text-white">Plan the work. Keep the team in sync.</p>
    </aside>

    <main className="flex min-w-0 flex-1 flex-col px-4 py-6 sm:px-8">
      <Link
        to="/"
        className={`inline-flex w-fit items-center gap-1 rounded-md text-sm font-medium text-fg-secondary hover:text-fg ${linkRing}`}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to home
      </Link>

      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-8">
        <Link to="/" aria-label="TaskBoard home" className={`mb-8 w-fit rounded-md lg:hidden ${linkRing}`}>
          <Logo size={32} />
        </Link>
        {children}
      </div>
    </main>
  </div>
);

export default AuthLayout;
