// PublicFooter (no props): the logo and a link to the GitHub repository.
// The link opens in a new tab, so its accessible name says so. No social icons, no legal pages.
import { ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Logo from '../Logo.jsx';

const PublicFooter = () => (
  <footer className="border-t border-line bg-surface">
    <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <Link
        to="/"
        aria-label="TaskBoard home"
        className="inline-flex min-h-10 w-fit items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
      >
        <Logo size={24} />
      </Link>
      <a
        href="https://github.com/24Chessman/TaskBoard"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="GitHub (opens in a new tab)"
        className="inline-flex min-h-10 w-fit items-center gap-1 rounded-md text-sm font-medium text-fg-secondary underline-offset-4 hover:text-fg hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
      >
        GitHub
        <ExternalLink size={14} aria-hidden="true" />
      </a>
    </div>
  </footer>
);

export default PublicFooter;
