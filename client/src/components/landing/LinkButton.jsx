// LinkButton props: to (router path), variant (primary | secondary | ghost, default primary),
// size (sm | md, default md), icon (a lucide icon component shown after the text, optional), className, children.
// A router <Link> that looks like the shared Button, so "Get started" is a real link (it goes to a page) but
// matches the button styles.
import { Link } from 'react-router-dom';
import { buttonVariants, focusRing } from '../Button.jsx';

const sizes = {
  sm: 'h-10 gap-1.5 px-3 text-sm sm:h-9',
  md: 'h-11 gap-2 px-5 text-sm sm:text-base',
};

const LinkButton = ({ to, variant = 'primary', size = 'md', icon: Icon, className = '', children }) => (
  <Link
    to={to}
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors active:translate-y-px ${focusRing} ${sizes[size] || sizes.md} ${buttonVariants[variant] || buttonVariants.primary} ${className}`}
  >
    {children}
    {Icon && <Icon size={16} aria-hidden="true" />}
  </Link>
);

export default LinkButton;
