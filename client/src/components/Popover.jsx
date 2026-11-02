// Popover props: label (the trigger's accessible name), triggerContent (what the trigger button shows),
// triggerClassName, children (the panel content: controls, not a menu), align ("start" | "end", default "start"),
// panelClassName, className (wrapper). A button that opens a small panel.
// Esc closes only the Popover when it is the top layer (utils/layers.js) and focus returns to the button; a click
// outside closes it (focus stays where the click went); the button has aria-expanded and aria-controls.
// Unlike Dropdown it is not a menu: Tab moves through the controls inside it, and Tab out of the panel closes it.
import { useEffect, useId, useRef, useState } from 'react';
import useLayer from '../hooks/useLayer.js';
import { isTopLayer } from '../utils/layers.js';

const Popover = ({ label, triggerContent, triggerClassName = '', children, align = 'start', panelClassName = '', className = '' }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const panelId = useId();
  const layerId = useLayer(open);

  // Move focus into the panel when it opens
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector('input, select, textarea, button, [href]')?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const handleMouseDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isTopLayer(layerId)) {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, layerId]);

  // Tabbing out of the panel (past its last control) closes it
  const handleBlur = (event) => {
    // relatedTarget is null when the click lands on non-focusable panel space: that must not close it
    if (event.relatedTarget && !rootRef.current?.contains(event.relatedTarget)) setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`} onBlur={handleBlur}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((current) => !current)}
        className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 ${triggerClassName}`}
      >
        {triggerContent}
      </button>

      {open && (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label={label}
          className={`absolute z-30 mt-2 w-72 animate-fade-in rounded-xl border border-line bg-surface p-4 shadow-lg ${align === 'end' ? 'right-0' : 'left-0'} ${panelClassName}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Popover;
