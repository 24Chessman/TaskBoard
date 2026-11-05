// coordinateGetter for dnd-kit's KeyboardSensor: ArrowRight / ArrowLeft move the dragged card to the next or the
// previous column (and stop at the ends), Up and Down do nothing (cards only change columns, never their order).
// The card keeps its horizontal offset inside the column and lands just below the column's top edge, so the
// collision check finds the column even when it is empty or shorter than the one the card came from.
const TOP_GAP = 12;

export const columnCoordinateGetter = (event, { context, currentCoordinates }) => {
  const direction = event.code === 'ArrowRight' ? 1 : event.code === 'ArrowLeft' ? -1 : 0;
  if (!direction) {
    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') event.preventDefault();
    return undefined;
  }
  event.preventDefault();

  const columns = [];
  context.droppableRects.forEach((rect, id) => columns.push({ id, rect }));
  columns.sort((a, b) => a.rect.left - b.rect.left);

  const rect = context.collisionRect;
  const middle = rect ? rect.left + rect.width / 2 : currentCoordinates.x;
  const index = columns.findIndex((column) => middle >= column.rect.left && middle <= column.rect.right);
  const target = columns[index + direction];
  if (index === -1 || !target) return undefined;

  return {
    x: target.rect.left + (currentCoordinates.x - columns[index].rect.left),
    y: target.rect.top + TOP_GAP,
  };
};
