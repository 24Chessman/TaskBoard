// useExclusiveMenu(open, close): makes sure only one Popover or Dropdown is open at a time. A menu calls it with its
// open state and a function that closes it WITHOUT moving focus. When a menu opens, the one that was open is closed
// (its close() runs), so opening the user menu closes the Filters popover and the other way round. Closing by Esc
// stays with each component (it returns focus to its own trigger); this only handles "another one opened".
import { useEffect, useId, useRef } from 'react';

let current = null; // { id, close } of the menu that is open right now

const useExclusiveMenu = (open, close) => {
  const id = useId();
  const closeRef = useRef(close);
  closeRef.current = close;

  useEffect(() => {
    if (!open) return undefined;
    if (current && current.id !== id) current.close();
    current = { id, close: () => closeRef.current() };
    return () => {
      if (current?.id === id) current = null;
    };
  }, [open, id]);
};

export default useExclusiveMenu;
