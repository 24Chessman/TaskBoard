// Sensors and collision detection for the board's drag and drop (dnd-kit).
// - Mouse and pen: a drag starts after 8px of movement, so a plain click still opens the task.
// - Touch: a 200ms press starts the drag (8px of tolerance), so swiping still scrolls the board sideways.
// - Keyboard: Space picks up and drops, Escape cancels; the arrows are handled by columnCoordinateGetter.
// PointerSensor also listens to touch pointers by default, which would fight with the touch sensor, so the
// pointer sensor used here ignores touch.
import { PointerSensor, pointerWithin, rectIntersection } from '@dnd-kit/core';
import { columnCoordinateGetter } from './keyboardCoordinates.js';

export class MousePointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown',
      handler: ({ nativeEvent }, { onActivation }) => {
        if (nativeEvent.pointerType === 'touch' || !nativeEvent.isPrimary || nativeEvent.button !== 0) return false;
        onActivation?.({ event: nativeEvent });
        return true;
      },
    },
  ];
}

export const mouseOptions = { activationConstraint: { distance: 8 } };
export const touchOptions = { activationConstraint: { delay: 200, tolerance: 8 } };
export const keyboardOptions = {
  keyboardCodes: { start: ['Space'], end: ['Space'], cancel: ['Escape'] },
  coordinateGetter: columnCoordinateGetter,
};

// The column under the pointer wins; with the keyboard (no pointer) the column the card overlaps the most does
export const collisionDetection = (args) => {
  const underPointer = pointerWithin(args);
  return underPointer.length > 0 ? underPointer : rectIntersection(args);
};
