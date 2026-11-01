// Dropdown props: label (the trigger's accessible name; required when the trigger is only an icon or avatar),
// triggerContent (what the trigger button shows), triggerClassName (style of the trigger button),
// items (array of { label, icon, onSelect, danger, disabled } or { type: 'separator' }),
// header (optional node shown at the top of the menu, not a menu item), align ("end" | "start", default "end"),
// className (wrapper). A button that opens a menu.
// Keyboard: Enter / Space / ArrowDown open it (ArrowUp opens on the last item); Arrow keys, Home and End move
// between items (wrapping); Enter or Space picks one; Esc closes and returns focus to the button; Tab closes.
// Clicking outside closes it. Esc closes only the top overlay (utils/layers.js).
import { useEffect, useId, useRef, useState } from 'react';
import useLayer from '../hooks/useLayer.js';
import { isTopLayer } from '../utils/layers.js';

const itemClass =
  'flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface-muted focus:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-ring disabled:cursor-not-allowed disabled:opacity-40';

const Dropdown = ({ label, triggerContent, triggerClassName = '', items = [], header, align = 'end', className = '' }) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const startAt = useRef('first');
  const menuId = useId();
  const layerId = useLayer(open);

  const enabledItems = () => Array.from(menuRef.current?.querySelectorAll('[role="menuitem"]:not(:disabled)') || []);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  };

  // On open, move focus to the first (or last) item
  useEffect(() => {
    if (!open) return;
    const list = enabledItems();
    (startAt.current === 'last' ? list[list.length - 1] : list[0])?.focus();
  }, [open]);

  // While open: outside click and Esc (top layer only)
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

  const handleTriggerKeyDown = (event) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      startAt.current = event.key === 'ArrowUp' ? 'last' : 'first';
      setOpen(true);
    }
  };

  const handleMenuKeyDown = (event) => {
    if (event.key === 'Tab') {
      setOpen(false);
      return;
    }
    const list = enabledItems();
    const index = list.indexOf(document.activeElement);
    const moves = {
      ArrowDown: list[(index + 1) % list.length],
      ArrowUp: list[(index - 1 + list.length) % list.length],
      Home: list[0],
      End: list[list.length - 1],
    };
    if (moves[event.key]) {
      event.preventDefault();
      moves[event.key].focus();
    }
  };

  const select = (item) => {
    close();
    item.onSelect?.();
  };

  return (
    <div ref={rootRef} className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => {
          startAt.current = 'first';
          setOpen((current) => !current);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={`focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring focus-visible:ring-offset-2 ${triggerClassName}`}
      >
        {triggerContent}
      </button>

      {open && (
        <div
          className={`absolute z-30 mt-2 min-w-56 animate-fade-in rounded-lg border border-line bg-surface py-1 shadow-lg ${align === 'end' ? 'right-0' : 'left-0'}`}
        >
          {header && <div className="border-b border-line px-3 py-2">{header}</div>}
          <div ref={menuRef} id={menuId} role="menu" aria-label={label} onKeyDown={handleMenuKeyDown}>
            {items.map((item, index) =>
              item.type === 'separator' ? (
                <div key={`separator-${index}`} role="separator" className="my-1 border-t border-line" />
              ) : (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  tabIndex={-1}
                  disabled={item.disabled}
                  onClick={() => select(item)}
                  className={`${itemClass} ${item.danger ? 'text-danger-fg' : 'text-fg'}`}
                >
                  {item.icon && <item.icon size={16} aria-hidden="true" className="shrink-0" />}
                  {item.label}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
