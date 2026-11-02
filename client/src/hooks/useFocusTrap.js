// useFocusTrap(ref, active): while active, Tab and Shift+Tab stay inside the element in ref (a dialog or drawer).
// trapTabTarget is the pure decision (easy to test): given the focusable items, where focus is now and whether
// Shift is held, it returns the element to move focus to, or null to let the browser move focus normally.
import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export const trapTabTarget = (items, activeElement, shiftKey, container) => {
  if (items.length === 0) return container; // nothing to tab to: keep focus on the container
  const first = items[0];
  const last = items[items.length - 1];
  const inside = items.includes(activeElement);
  if (shiftKey) return activeElement === first || !inside ? last : null;
  return activeElement === last || !inside ? first : null;
};

const getFocusable = (container) =>
  Array.from(container.querySelectorAll(FOCUSABLE)).filter(
    (node) => node.getAttribute('aria-hidden') !== 'true' && (node.offsetWidth || node.offsetHeight || node.getClientRects().length)
  );

const useFocusTrap = (ref, active) => {
  useEffect(() => {
    const container = ref.current;
    if (!active || !container) return undefined;

    const handleKeyDown = (event) => {
      if (event.key !== 'Tab') return;
      const target = trapTabTarget(getFocusable(container), document.activeElement, event.shiftKey, container);
      if (target) {
        event.preventDefault();
        target.focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [ref, active]);
};

export default useFocusTrap;
