// LabelsChart props: topLabels ([{ label, count }], up to 8, most used first). One row per label: the label as a chip, a thin
// bar from zero and the count at the bar end. With no labels it says so instead of drawing an empty chart.
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import Badge from '../Badge.jsx';
import ChartCard from './ChartCard.jsx';
import { VALUE_LABEL } from './chartStyle.js';
import { clip } from './helpers.js';
import RowTick from './RowTick.jsx';

const ROW = 30;
const LABEL_WIDTH = 130;

const LabelsChart = ({ topLabels }) => {
  const max = Math.max(1, ...topLabels.map((row) => row.count));
  const summary = topLabels.length ? `Top labels: ${topLabels.map((row) => `${row.label} ${row.count}`).join(', ')}.` : 'No task has a label yet.';

  return (
    <ChartCard
      title="Top labels"
      description="The labels used on the most tasks."
      summary={summary}
      data={{ caption: 'Top labels', columns: ['Label', 'Tasks'], rows: topLabels.map((row) => [row.label, row.count]) }}
    >
      {topLabels.length === 0 ? (
        <p className="py-6 text-sm text-fg-secondary">No task has a label yet. Labels added to tasks will show up here.</p>
      ) : (
        <ResponsiveContainer width="100%" height={topLabels.length * ROW + 8}>
          <BarChart layout="vertical" data={topLabels} margin={{ top: 4, right: 32, bottom: 4, left: 0 }} accessibilityLayer={false}>
            <XAxis type="number" hide domain={[0, max]} />
            <YAxis
              type="category"
              dataKey="label"
              width={LABEL_WIDTH}
              tickLine={false}
              tick={({ x, y, payload }) => (
                <RowTick x={x} y={y} width={LABEL_WIDTH}>
                  <Badge title={payload.value}>{clip(payload.value, 14)}</Badge>
                </RowTick>
              )}
            />
            <Bar dataKey="count" barSize={6} fill="currentColor" className="text-brand" isAnimationActive={false}>
              <LabelList dataKey="count" position="right" className={VALUE_LABEL} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  );
};

export default LabelsChart;
