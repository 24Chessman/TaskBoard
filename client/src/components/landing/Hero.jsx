// Hero (no props): the first section of the landing page, left aligned. The text column (max about 520px) holds
// the page's only <h1>, one sentence, the two buttons and a quiet line. On desktop the board mock is placed from
// the right of that column to the right edge of the window, so it runs off the edge like a real app window (the
// section clips it). On phones the mock sits under the buttons at full width and is cropped on the right.
// This is the only part of the page that animates: a 200ms fade and 8px rise, switched off for reduced motion.
import { ArrowRight } from 'lucide-react';
import BoardMock from './mocks/BoardMock.jsx';
import LinkButton from './LinkButton.jsx';

const Hero = () => (
  <section aria-labelledby="hero-title" className="overflow-hidden">
    <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:min-h-[500px] lg:px-8 lg:py-24">
      <div className="max-w-[520px] motion-safe:animate-fade-rise">
        <h1 id="hero-title" className="break-words text-4xl font-semibold tracking-tight text-fg sm:text-5xl">
          Plan the work. Move it across the board.
        </h1>
        <p className="mt-5 text-lg text-fg-secondary">A kanban board for your team, with roles and an activity history.</p>
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

      <div className="mt-12 motion-safe:animate-fade-rise lg:absolute lg:left-[600px] lg:top-24 lg:mt-0 lg:w-[calc(100vw-max(0px,(100vw-1280px)/2)-600px)]">
        <div className="overflow-hidden">
          <BoardMock className="w-[780px] max-w-none lg:w-[860px]" />
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
