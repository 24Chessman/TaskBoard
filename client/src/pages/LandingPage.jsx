// Public landing page (route "/", guests only; see routes/HomeRoute.jsx). Composes the sections in
// components/landing/. One <h1> (in the Hero) and one <h2> per other section.
import Hero from '../components/landing/Hero.jsx';
import PublicHeader from '../components/landing/PublicHeader.jsx';

const LandingPage = () => (
  <div className="min-h-screen bg-surface font-sans text-fg">
    <PublicHeader />
    <main>
      <Hero />
    </main>
  </div>
);

export default LandingPage;
