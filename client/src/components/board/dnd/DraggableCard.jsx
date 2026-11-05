// DraggableCard props: task, onOpen(task). A board card that can be dragged to another column. It is still the one
// TaskCard button (one tab stop, one descriptive accessible name): the drag listeners sit on that same button.
// Opening the task is blocked while a drag is running and for a moment after it ends, so neither the click that
// follows a mouse drop nor the Space key-up of a keyboard drag opens the drawer. Enter still opens it.
import { useDraggable } from '@dnd-kit/core';
import { useContext } from 'react';
import TaskCard from '../TaskCard.jsx';
import DragEnabledContext from './DragEnabledContext.js';

const GUARD_MS = 600;
let guardUntil = 0;

// Called by BoardDnd when a drag starts or ends
export const guardCardClicks = () => {
  guardUntil = Date.now() + GUARD_MS;
};
const guarded = () => Date.now() < guardUntil;

const DraggableCard = ({ task, onOpen }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task._id,
    data: { task },
    disabled: !useContext(DragEnabledContext),
  });

  const open = (target) => {
    if (!isDragging && !guarded()) onOpen(target);
  };

  const buttonProps = {
    ...listeners,
    'aria-describedby': attributes['aria-describedby'],
    'aria-roledescription': attributes['aria-roledescription'],
    'data-task-id': task._id,
    className: `select-none ${isDragging ? 'opacity-40' : ''}`,
    onKeyUp: (event) => {
      if (event.code === 'Space' && (isDragging || guarded())) event.preventDefault();
    },
  };

  return <TaskCard task={task} onOpen={open} buttonRef={setNodeRef} buttonProps={buttonProps} />;
};

export default DraggableCard;
