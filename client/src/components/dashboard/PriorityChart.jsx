// PriorityChart props: byPriority ({ high, medium, low }), total. Three horizontal bars (High, Medium, Low) from a zero
// baseline, each labelled with the shared PriorityBadge (icon and name) and the count printed at the bar end.
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import PriorityBadge, { PRIORITY_BADGES } from '../PriorityBadge.jsx';
import ChartCard from './ChartCard.jsx';
import { VALUE_LABEL } from './chartStyle.js';
import { niceMax } from './helpers.js';
import RowTick from './RowTick.jsx';

// Bar colours come from the priority roles, as classes (no hex values)
const COLORS = { high: 'fill-danger', medium: 'fill-warning-strong', low: 'fill-info' };
const ORDER = ['high', 'medium', 'low'];
const ROW = 36;
const LABEL_WIDTH = 104;

const PriorityBar = ({ x, y, width, height, payload }) => (
  <rect x={x} y={y} width={Math.max(width, 0)} height={height} className={COLORS[payload.key]} />
);

const PriorityChart = ({ byPriority, total }) => {
  const rows = ORDER.map((key) => ({ key, name: PRIORITY_BADGES[key].label, count: byPriority[key] }));
  const summary = `Tasks by priority, ${total} in all: ${rows.map((row) => `${row.name} ${row.count}`).join(', ')}.`;

  return (
    <ChartCard
      title="Tasks by priority"
      description="How urgent the tasks in this project are."
      summary={summary}
      data={{ caption: 'Tasks by priority', columns: ['Priority', 'Tasks'], rows: rows.map((row) => [row.name, row.count]) }}
    >
      <ResponsiveContainer width="100%" height={rows.length * ROW + 8}>
        <BarChart layout="vertical" data={rows} margin={{ top: 4, right: 36, bottom: 4, left: 0 }} accessibilityLayer={false}>
          <XAxis type="number" hide domain={[0, niceMax(Math.max(...rows.map((row) => row.count)))]} />
          <YAxis
            type="category"
            dataKey="key"
            width={LABEL_WIDTH}
            tickLine={false}
            tick={({ x, y, payload }) => (
              <RowTick x={x} y={y} width={LABEL_WIDTH}>
                <PriorityBadge priority={payload.value} />
              </RowTick>
            )}
          />
          <Bar dataKey="count" barSize={14} isAnimationActive={false} shape={<PriorityBar />}>
            <LabelList dataKey="count" position="right" className={VALUE_LABEL} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default PriorityChart;
