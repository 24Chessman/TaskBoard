// Hero (no props): the first section of the landing page. Two columns on desktop (text, then the board preview),
// stacked on phones. Contains the page's only <h1>. Fades in and rises 8px once, unless motion is reduced.
import { ArrowRight } from 'lucide-react';
import BoardPreview from './BoardPreview.jsx';
import LinkButton from './LinkButton.jsx';

const Hero = () => (
  <section aria-labelledby="hero-title" className="relative overflow-hidden">
    <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-16 lg:px-8">
      <div className="motion-safe:animate-fade-rise">
        <h1
          id="hero-title"
          className="break-words text-4xl font-semibold tracking-tight text-fg sm:text-5xl"
        >
          Plan the work. Move it across the board.
        </h1>
        <p className="mt-5 max-w-xl text-lg text-fg-secondary">
          A kanban board for your team, with roles and activity history.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <LinkButton to="/register" icon={ArrowRight}>
            Get started free
          </LinkButton>
          <LinkButton to="/login" variant="secondary">
            Log in
          </LinkButton>
        </div>
        <p className="mt-4 text-sm text-fg-secondary">Free for your team. No card needed.</p>
      </div>

      <div className="min-w-0 motion-safe:animate-fade-rise">
        <BoardPreview />
      </div>
    </div>
  </section>
);

export default Hero;
