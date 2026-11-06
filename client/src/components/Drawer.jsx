// Drawer props: isOpen (renders nothing when false), onClose, title (the heading and the accessible name),
// children (the body, scrolls inside the drawer), side ("right" | "left", default "right"),
// size ("sm" | "md" | "lg", default "lg": up to 384px, 576px or 720px on desktop; always full width on phones).
// A panel that slides in over a dark overlay (a short fade-in/slide that is switched off for reduced motion).
// Behaves like Modal: focus moves in on open and returns on close, Tab stays inside, clicking the overlay closes,
// and Esc closes only the top overlay (utils/layers.js), so a menu or dialog opened inside it closes first.
// DrawerPanel is the same markup without the portal and effects; it is exported so it can be rendered in tests.
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import useFocusTrap from '../hooks/useFocusTrap.js';
import useLayer from '../hooks/useLayer.js';
import { isTopLayer } from '../utils/layers.js';
import IconButton from './IconButton.jsx';

const sizes = { sm: 'sm:max-w-sm', md: 'sm:max-w-xl', lg: 'sm:max-w-[720px]' };
const sides = {
  right: 'right-0 animate-drawer-in-right sm:rounded-l-xl',
  left: 'left-0 animate-drawer-in-left sm:rounded-r-xl',
};

export const DrawerPanel = ({ title, titleId, side = 'right', size = 'lg', onClose, panelRef, children }) => (
  <div className="fixed inset-0 z-40">
    <div className="absolute inset-0 animate-fade-in bg-slate-900/50" onClick={onClose} aria-hidden="true" />
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className={`absolute inset-y-0 flex w-full flex-col bg-surface shadow-xl focus:outline-none ${sizes[size] || sizes.lg} ${sides[side] || sides.right}`}
    >
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <h2 id={titleId} className="min-w-0 break-words text-base font-semibold text-fg">
          {title}
        </h2>
        <IconButton icon={X} label="Close" onClick={onClose} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  </div>
);

const Drawer = ({ isOpen, onClose, title, children, side, size }) => {
  const titleId = useId();
  const panelRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const layerId = useLayer(isOpen);
  useFocusTrap(panelRef, isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    panelRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isTopLayer(layerId)) onCloseRef.current();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [isOpen, layerId]);

  if (!isOpen) return null;

  return createPortal(
    <DrawerPanel title={title} titleId={titleId} side={side} size={size} onClose={onClose} panelRef={panelRef}>
      {children}
    </DrawerPanel>,
    document.body
  );
};

export default Drawer;
