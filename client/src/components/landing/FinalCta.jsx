// FinalCta (no props): the closing call to action, an indigo band with a white primary button and a Log in link.
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LinkButton from './LinkButton.jsx';

const FinalCta = () => (
  <section aria-labelledby="cta-title" className="bg-brand">
    <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:justify-between lg:px-8">
      <div className="max-w-2xl">
        <h2 id="cta-title" className="text-3xl font-semibold tracking-tight text-white">
          Ready to plan your next project?
        </h2>
        <p className="mt-2 text-lg text-white/90">Create an account and set up your first board in a minute.</p>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <LinkButton to="/register" variant="inverse" icon={ArrowRight}>
          Get started free
        </LinkButton>
        <Link
          to="/login"
          className="rounded-md px-1 py-1 text-sm font-medium text-white underline underline-offset-4 hover:no-underline focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-brand"
        >
          Log in
        </Link>
      </div>
    </div>
  </section>
);

export default FinalCta;
