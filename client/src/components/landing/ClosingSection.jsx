// ClosingSection (no props): the quiet end of the landing page on the app background (not a coloured band).
// An h2, one sentence, the primary button, a "Log in" link, and a small hand-drawn SVG of a card moving to Done.
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import MoveCardArt from './art/MoveCardArt.jsx';
import LinkButton from './LinkButton.jsx';

const ClosingSection = () => (
  <section aria-labelledby="closing-title" className="border-t border-line bg-app py-12 lg:py-16">
    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
      <div className="max-w-prose">
        <h2 id="closing-title" className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          Start your first board
        </h2>
        <p className="mt-4 text-base text-fg-secondary">Create an account, name a project and add your first task.</p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <LinkButton to="/register" icon={ArrowRight}>
            Get started free
          </LinkButton>
          <Link
            to="/login"
            className="inline-flex min-h-10 items-center rounded-md px-1 text-sm font-medium text-brand-fg underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring"
          >
            Log in
          </Link>
        </div>
      </div>
      <MoveCardArt className="mx-auto w-full max-w-sm lg:ml-auto lg:mr-0" />
    </div>
  </section>
);

export default ClosingSection;
