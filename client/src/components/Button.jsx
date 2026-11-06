// Button props: variant (primary | secondary | danger | ghost, default primary), size (sm | md, default md),
// leftIcon (a lucide icon component, optional), loading (shows a spinner and disables the button), disabled,
// type (default "button"), className, children, plus any native button props.
// Heights are 40px on phones (touch target) and 36px (md) / 32px (sm) from the sm breakpoint.
import { Loader2 } from 'lucide-react';

export const buttonVariants = {
  primary: 'bg-brand text-white hover:bg-brand-hover active:bg-brand-hover',
  secondary: 'border border-line bg-surface text-fg hover:bg-app active:bg-surface-muted',
  danger: 'bg-danger text-white hover:bg-danger-hover active:bg-danger-hover',
  ghost: 'text-fg-secondary hover:bg-surface-muted hover:text-fg active:bg-line',
};

export const focusRing = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2';

const sizes = {
  sm: 'h-10 gap-1.5 px-2.5 text-xs sm:h-8',
  md: 'h-10 gap-2 px-3.5 text-sm sm:h-9',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  leftIcon: LeftIcon,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  children,
  ...rest
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    className={`inline-flex items-center justify-center rounded-md font-medium transition-colors active:translate-y-px disabled:cursor-not-allowed disabled:opacity-40 ${focusRing} ${sizes[size] || sizes.md} ${buttonVariants[variant] || buttonVariants.primary} ${className}`}
    {...rest}
  >
    {loading ? (
      <Loader2 size={16} aria-hidden="true" className="animate-spin motion-reduce:animate-none" />
    ) : (
      LeftIcon && <LeftIcon size={16} aria-hidden="true" />
    )}
    {children}
  </button>
);

export default Button;
