// PublicHeader (no props): the sticky top bar of the public pages. Logo (links to "/"), the section links
// "Product" and "Roles" (they scroll smoothly, or jump when the user prefers reduced motion), a quiet
// "Log in" link and a filled "Get started" button. Under 768px the section links move into a slide-over Drawer
// opened by a menu button; it closes on Esc, on overlay click and after a link is chosen.
// The bottom border only appears once the page has scrolled.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Drawer from '../Drawer.jsx';
import IconButton from '../IconButton.jsx';
import Logo from '../Logo.jsx';
import LinkButton from './LinkButton.jsx';

const SECTION_LINKS = [
  { id: 'product', label: 'Product' },
  { id: 'roles', label: 'Roles' },
];

const linkClass =
  'inline-flex min-h-10 items-center rounded-md px-3 py-2 text-sm font-medium text-fg-secondary transition-colors hover:bg-surface-muted hover:text-fg active:bg-line focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring';

const scrollToSection = (id) => {
  const target = document.getElementById(id);
  if (!target) return false;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  window.history.replaceState(null, '', `#${id}`);
  return true;
};

const PublicHeader = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Without JavaScript the plain #hash link still jumps to the section
  const handleSectionClick = (event, id, closeMenu = false) => {
    if (!document.getElementById(id)) return;
    event.preventDefault();
    if (closeMenu) {
      setMenuOpen(false);
      setTimeout(() => scrollToSection(id), 0); // after the drawer has closed and returned focus
    } else {
      scrollToSection(id);
    }
  };

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-surface transition-colors ${scrolled ? 'border-line' : 'border-transparent'}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          aria-label="TaskBoard home"
          className="inline-flex min-h-10 items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2"
        >
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {SECTION_LINKS.map((link) => (
            <a key={link.id} href={`#${link.id}`} onClick={(event) => handleSectionClick(event, link.id)} className={linkClass}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/login" className={`${linkClass} hidden md:inline-flex`}>
            Log in
          </Link>
          <LinkButton to="/register" size="sm">
            Get started
          </LinkButton>
          <IconButton icon={Menu} label="Open menu" className="md:hidden" onClick={() => setMenuOpen(true)} />
        </div>
      </div>

      <Drawer isOpen={menuOpen} onClose={() => setMenuOpen(false)} title="Menu" side="left" size="sm">
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {SECTION_LINKS.map((link) => (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(event) => handleSectionClick(event, link.id, true)}
              className={`${linkClass} py-3 text-base`}
            >
              {link.label}
            </a>
          ))}
          <Link to="/login" onClick={() => setMenuOpen(false)} className={`${linkClass} py-3 text-base`}>
            Log in
          </Link>
          <LinkButton to="/register" className="mt-3">
            Get started free
          </LinkButton>
        </nav>
      </Drawer>
    </header>
  );
};

export default PublicHeader;
