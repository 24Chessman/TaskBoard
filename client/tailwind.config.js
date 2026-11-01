// Design tokens (docs/design.md section 5). Colours are ROLES backed by CSS variables on :root (see src/index.css),
// so components say "bg-brand" or "text-fg-muted" instead of a raw palette colour, and a role can be changed in one
// place. The default Tailwind palette stays available, so existing screens keep working.
const role = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      colors: {
        app: role('app'),
        surface: { DEFAULT: role('surface'), muted: role('surface-muted') },
        line: role('line'),
        fg: { DEFAULT: role('fg'), secondary: role('fg-secondary'), muted: role('fg-muted') },
        brand: {
          DEFAULT: role('brand'),
          hover: role('brand-hover'),
          soft: role('brand-soft'),
          fg: role('brand-fg'),
          ring: role('brand-ring'),
        },
        // Semantic colours: DEFAULT for solid use, soft + fg for lozenges (the "subtle" emphasis level),
        // strong for small icons that need 3:1 against white.
        danger: { DEFAULT: role('danger'), hover: role('danger-hover'), soft: role('danger-soft'), fg: role('danger-fg') },
        success: { DEFAULT: role('success'), soft: role('success-soft'), fg: role('success-fg') },
        warning: { DEFAULT: role('warning'), strong: role('warning-strong'), soft: role('warning-soft'), fg: role('warning-fg') },
        info: { DEFAULT: role('info'), soft: role('info-soft'), fg: role('info-fg') },
        neutral: { soft: role('neutral-soft'), fg: role('neutral-fg') },
      },
      // Radius and shadow use Tailwind's own scales, which already match the brief:
      // rounded-md 6px (inputs, buttons), rounded-lg 8px (cards), rounded-xl 12px (columns, drawer, modal);
      // shadow-sm cards, shadow-md card hover, shadow-xl drawer and modal.
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-rise': { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'drawer-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'drawer-in-left': { from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(0)' } },
      },
      // Short is 150ms, long is 250ms; the drawer slide is 200ms. index.css switches them all off for reduced motion.
      animation: {
        'fade-in': 'fade-in 150ms ease-out',
        'fade-rise': 'fade-rise 200ms ease-out',
        'toast-in': 'fade-rise 150ms ease-out',
        'drawer-in-right': 'drawer-in-right 200ms ease-out',
        'drawer-in-left': 'drawer-in-left 200ms ease-out',
      },
    },
  },
  plugins: [],
};
