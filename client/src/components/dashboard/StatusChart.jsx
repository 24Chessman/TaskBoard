// StatusChart props: byStatus ({ todo, in_progress, review, done }), total. One horizontal stacked bar for the whole
// project in status order, and under it a legend with the status icon, name, count and percent, so colour is never the only
// carrier. Segment colours: neutral, cobalt, amber, green (the status lozenge hues). Segment percents add up to 100.
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { STATUS_LOZENGES } from '../StatusLozenge.jsx';
import ChartCard from './ChartCard.jsx';
import { segmentPercents } from './helpers.js';

const SEGMENTS = [
  { key: 'todo', color: 'text-fg-muted' },
  { key: 'in_progress', color: 'text-brand' },
  { key: 'review', color: 'text-warning-strong' },
  { key: 'done', color: 'text-success' },
];

const StatusChart = ({ byStatus, total }) => {
  const counts = SEGMENTS.map((segment) => byStatus[segment.key]);
  const percents = segmentPercents(counts);
  const summary = `Tasks by status, ${total} in all: ${SEGMENTS.map((s, i) => `${STATUS_LOZENGES[s.key].label} ${counts[i]} (${percents[i]}%)`).join(', ')}.`;

  return (
    <ChartCard
      title="Tasks by status"
      description="Where the work stands across the board columns."
      summary={summary}
      data={{
        caption: 'Tasks by status',
        columns: ['Status', 'Tasks', 'Percent of all tasks'],
        rows: SEGMENTS.map((s, i) => [STATUS_LOZENGES[s.key].label, counts[i], `${percents[i]}%`]),
      }}
    >
      <ResponsiveContainer width="100%" height={40}>
        <BarChart layout="vertical" data={[{ name: 'Tasks', ...byStatus }]} margin={{ top: 4, right: 0, bottom: 4, left: 0 }} accessibilityLayer={false}>
          <XAxis type="number" hide domain={[0, Math.max(total, 1)]} />
          <YAxis type="category" hide dataKey="name" />
          {SEGMENTS.map((segment) => (
            <Bar
              key={segment.key}
              dataKey={segment.key}
              stackId="status"
              barSize={24}
              fill="currentColor"
              className={`${segment.color} [&_path]:stroke-surface [&_path]:stroke-1`}
              isAnimationActive={false}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
      <ul className="mt-3 grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
        {SEGMENTS.map((segment, i) => {
          const { label, icon: Icon } = STATUS_LOZENGES[segment.key];
          return (
            <li key={segment.key} className="flex items-center gap-2 text-fg">
              <Icon size={16} aria-hidden="true" className={`shrink-0 ${segment.color}`} />
              <span className="min-w-0 flex-1 truncate">{label}</span>
              <span className="font-mono tabular-nums">{counts[i]}</span>
              <span className="w-10 text-right font-mono text-xs tabular-nums text-fg-secondary">{percents[i]}%</span>
            </li>
          );
        })}
      </ul>
    </ChartCard>
  );
};

export default StatusChart;
