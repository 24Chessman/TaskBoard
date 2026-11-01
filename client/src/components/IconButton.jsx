// IconButton props: icon (a lucide icon component), label (REQUIRED: used as the accessible name and the tooltip),
// variant (primary | secondary | danger | ghost, default ghost), size (sm | md, default md), className,
// plus any native button props (onClick, disabled, type...). A square button that shows only an icon.
// Touch target is 40px on phones; from the sm breakpoint md is 32px and sm is 28px.
import { buttonVariants, focusRing } from './Button.jsx';

const sizes = {
  sm: 'h-9 w-9 sm:h-7 sm:w-7',
  md: 'h-10 w-10 sm:h-8 sm:w-8',
};

const IconButton = ({ icon: Icon, label, variant = 'ghost', size = 'md', className = '', type = 'button', ...rest }) => {
  if (!label && import.meta.env.DEV) console.warn('IconButton needs a label: it is the only accessible name');

  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-md transition-colors active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 ${focusRing} ${sizes[size] || sizes.md} ${buttonVariants[variant] || buttonVariants.ghost} ${className}`}
      {...rest}
    >
      <Icon size={size === 'sm' ? 14 : 16} aria-hidden="true" />
    </button>
  );
};

export default IconButton;
