// Screen reader texts for dragging a card (dnd-kit's live region). The names are the board's column titles.
// active.data.current is { task } set by the draggable card, and it holds the task as it was when picked up, so
// the "from" column stays right even after the card has moved on screen.
import { columnTitle } from './dndLogic.js';

export const screenReaderInstructions = {
  draggable:
    'Press Space to pick up this task, then use the left and right arrow keys to choose a column, Space to drop and Escape to cancel. Press Enter to open the task instead.',
};

const taskOf = (item) => item?.data?.current?.task;

export const buildAnnouncements = (columns) => ({
  onDragStart: ({ active }) => {
    const task = taskOf(active);
    return `Picked up task ${task?.title}${task ? ` from ${columnTitle(columns, task.status)}` : ''}. Use left and right arrow keys to choose a column, Space to drop, Escape to cancel.`;
  },
  onDragOver: ({ active, over }) => {
    const task = taskOf(active);
    return over ? `${task?.title} is over ${columnTitle(columns, over.id)}.` : `${task?.title} is not over a column.`;
  },
  onDragEnd: ({ active, over }) => {
    const task = taskOf(active);
    if (!over) return `Dropped ${task?.title} outside the columns, nothing changed.`;
    if (task?.status === over.id) return `Dropped ${task.title} back in ${columnTitle(columns, over.id)}, nothing changed.`;
    return `Dropped ${task?.title} in ${columnTitle(columns, over.id)}.`;
  },
  onDragCancel: ({ active }) => {
    const task = taskOf(active);
    return `Move cancelled, ${task?.title} returned to ${task ? columnTitle(columns, task.status) : 'its column'}.`;
  },
});
