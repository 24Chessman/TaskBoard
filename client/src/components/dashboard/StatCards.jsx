// StatCards props: data (the dashboard response). A row of five compact cards: total, in progress, done (with the percent
// of all tasks), overdue and due in 7 days. Overdue turns red and gets an alarm clock only when it is above 0: the
// number, the icon and the line say it, so colour is never the only signal.
import { AlarmClock } from 'lucide-react';
import Card from '../Card.jsx';
import { segmentPercents } from './helpers.js';

const Stat = ({ label, value, line, danger = false }) => (
  <Card className="p-4">
    <p className="text-sm text-fg-secondary">{label}</p>
    <p className={`mt-1 flex items-center gap-2 text-2xl font-semibold tabular-nums ${danger ? 'text-danger-fg' : 'text-fg'}`}>
      {danger && <AlarmClock size={20} aria-hidden="true" />}
      {value}
    </p>
    <p className="mt-1 text-xs text-fg-secondary">{line}</p>
  </Card>
);

const StatCards = ({ data }) => {
  const { total, byStatus, overdue, dueSoon } = data;
  // The same rounding as the status chart legend, so the two always show the same percents
  const [, inProgressPercent, , donePercent] = segmentPercents([byStatus.todo, byStatus.in_progress, byStatus.review, byStatus.done]);
  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-5">
      <Stat label="Total tasks" value={total} line="All tasks in this project" />
      <Stat label="In progress" value={byStatus.in_progress} line={`${inProgressPercent}% of all tasks`} />
      <Stat label="Done" value={byStatus.done} line={`${donePercent}% of all tasks`} />
      <Stat label="Overdue" value={overdue} line="Not Done and due before today" danger={overdue > 0} />
      <Stat label="Due in 7 days" value={dueSoon} line="Not Done, due today to 7 days ahead" />
    </div>
  );
};

export default StatCards;
