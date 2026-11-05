// BoardDnd props: columns ([{ id, title }]), tasks (every task with its on-screen status), disabled (true while a
// modal or the drawer is open), onMove(task, status), columnProps (passed on to every Column). Draws the board grid
// and lets cards be dragged between its columns with mouse, touch or keyboard (see sensors.js). Dropping on the same
// column, or outside every column, does nothing. A card is only ever moved between columns; their order is not kept.
import { DndContext, DragOverlay, KeyboardSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useMemo, useState } from 'react';
import Column from '../Column.jsx';
import TaskCard from '../TaskCard.jsx';
import { buildAnnouncements, screenReaderInstructions } from './announcements.js';
import { guardCardClicks } from './DraggableCard.jsx';
import { groupByStatus, isMove } from './dndLogic.js';
import { collisionDetection, keyboardOptions, MousePointerSensor, mouseOptions, touchOptions } from './sensors.js';

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const noop = () => {};

const BoardDnd = ({ columns, tasks, disabled, onMove, columnProps }) => {
  const mouse = useSensor(MousePointerSensor, mouseOptions);
  const touch = useSensor(TouchSensor, touchOptions);
  const keyboard = useSensor(KeyboardSensor, keyboardOptions);
  const sensors = useSensors(...(disabled ? [] : [mouse, touch, keyboard]));
  const accessibility = useMemo(() => ({ announcements: buildAnnouncements(columns), screenReaderInstructions }), [columns]);
  const [active, setActive] = useState(null); // { task, width } while a card is being dragged
  const byStatus = groupByStatus(columns, tasks);

  const finish = (event, move) => {
    const task = event.active.data.current?.task;
    guardCardClicks();
    setActive(null);
    if (move && isMove(columns, task, event.over?.id)) onMove(task, event.over.id);
    // A moved card is a new element in its new column, so keyboard users get their focus back on it
    if (event.activatorEvent instanceof KeyboardEvent) {
      requestAnimationFrame(() => requestAnimationFrame(() => document.querySelector(`[data-task-id="${task._id}"]`)?.focus()));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      accessibility={accessibility}
      onDragStart={({ active: item }) => {
        guardCardClicks();
        setActive({ task: item.data.current.task, width: item.rect.current.initial?.width });
      }}
      onDragEnd={(event) => finish(event, true)}
      onDragCancel={(event) => finish(event, false)}
    >
      <div
        data-dragging={active ? 'true' : 'false'}
        className="group/board flex gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible"
      >
        {columns.map((column) => (
          <Column key={column.id} id={column.id} title={column.title} tasks={byStatus[column.id]} {...columnProps} />
        ))}
      </div>
      <DragOverlay dropAnimation={prefersReducedMotion() ? null : undefined}>
        {active && (
          <div aria-hidden="true" style={{ width: active.width }}>
            <TaskCard task={active.task} onOpen={noop} dragging buttonProps={{ tabIndex: -1 }} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default BoardDnd;
