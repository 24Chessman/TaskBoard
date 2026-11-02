// Public landing page (route "/", guests only; see routes/HomeRoute.jsx). Product-first (docs/design.md 7.1):
// header, a left-aligned hero with a large board mock, four alternating feature rows, a quiet closing section and
// the footer. Landmarks: header, main, footer. One <h1> (in the Hero) and one <h2> per row.
// Everything is HTML, CSS, icons and hand-authored SVG: no images, and only honest content (no testimonials,
// counts or logos). The mocks use fake sample data and are hidden from assistive technology.
import ClosingSection from '../components/landing/ClosingSection.jsx';
import Hero from '../components/landing/Hero.jsx';
import ProductRows from '../components/landing/ProductRows.jsx';
import PublicFooter from '../components/landing/PublicFooter.jsx';
import PublicHeader from '../components/landing/PublicHeader.jsx';

const LandingPage = () => (
  <div className="min-h-screen bg-surface font-sans text-fg">
    <PublicHeader />
    <main>
      <Hero />
      <ProductRows />
      <ClosingSection />
    </main>
    <PublicFooter />
  </div>
);

export default LandingPage;
