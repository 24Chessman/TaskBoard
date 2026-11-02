// Public landing page (route "/", guests only; see routes/HomeRoute.jsx). Composes the sections in
// components/landing/. Landmarks: header, main, footer. One <h1> (in the Hero) and one <h2> per other section.
// Everything is HTML, CSS and icons: no images, and only honest content (no testimonials, counts or logos).
import FinalCta from '../components/landing/FinalCta.jsx';
import Features from '../components/landing/Features.jsx';
import Hero from '../components/landing/Hero.jsx';
import HowItWorks from '../components/landing/HowItWorks.jsx';
import PublicFooter from '../components/landing/PublicFooter.jsx';
import PublicHeader from '../components/landing/PublicHeader.jsx';
import TrustStrip from '../components/landing/TrustStrip.jsx';

const LandingPage = () => (
  <div className="min-h-screen bg-surface font-sans text-fg">
    <PublicHeader />
    <main>
      <Hero />
      <TrustStrip />
      <Features />
      <HowItWorks />
      <FinalCta />
    </main>
    <PublicFooter />
  </div>
);

export default LandingPage;
