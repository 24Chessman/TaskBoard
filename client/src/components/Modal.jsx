// Modal props: isOpen (renders nothing when false), onClose (called on Esc or overlay click),
// title (heading text, also the dialog's accessible name), children (dialog body).
// Focus moves into the dialog on open and returns to the previous element on close; Tab stays inside the dialog;
// Esc closes only the top overlay (see utils/layers.js), so a Dropdown or ConfirmDialog above it closes first.
import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import useFocusTrap from '../hooks/useFocusTrap.js';
import useLayer from '../hooks/useLayer.js';
import { isTopLayer } from '../utils/layers.js';

const Modal = ({ isOpen, onClose, title, children }) => {
  const titleId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const layerId = useLayer(isOpen);
  useFocusTrap(dialogRef, isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();

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
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-xl bg-surface p-6 shadow-xl focus:outline-none"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="mb-4 text-lg font-semibold text-fg">
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
