// CreatedChart props: createdPerDay ([{ date: "YYYY-MM-DD", count }], 14 days, oldest first). A small column chart of tasks
// created per day: the axis starts at zero and tops out at a round number, a day with no tasks keeps a thin baseline tick,
// non-zero columns carry their value, and the x labels show every third day ("Nov 5"). Days are in UTC.
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import ChartCard from './ChartCard.jsx';
import { GRID, TICK, VALUE_LABEL } from './chartStyle.js';
import { niceMax, shortDay } from './helpers.js';

const CreatedChart = ({ createdPerDay }) => {
  const sum = createdPerDay.reduce((total, day) => total + day.count, 0);
  const max = niceMax(Math.max(0, ...createdPerDay.map((day) => day.count)));
  const days = createdPerDay.filter((day) => day.count > 0).map((day) => `${shortDay(day.date)} ${day.count}`);
  const range = createdPerDay.length ? `${shortDay(createdPerDay[0].date)} to ${shortDay(createdPerDay[createdPerDay.length - 1].date)}` : 'the last 14 days';
  const summary = `Tasks created per day, ${range}: ${sum} in all${days.length ? `, ${days.join(', ')}` : ''}.`;

  return (
    <ChartCard
      title="Created in the last 14 days"
      description="How many new tasks were added each day."
      summary={summary}
      caption="Days are in UTC."
      data={{ caption: 'Tasks created per day (UTC)', columns: ['Day', 'Tasks created'], rows: createdPerDay.map((day) => [shortDay(day.date), day.count]) }}
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={createdPerDay} margin={{ top: 16, right: 4, bottom: 0, left: 0 }} accessibilityLayer={false}>
          <CartesianGrid vertical={false} className={GRID} />
          <XAxis dataKey="date" tickFormatter={shortDay} interval={2} tickLine={false} tick={TICK} />
          <YAxis allowDecimals={false} domain={[0, max]} ticks={[0, max]} width={32} tickLine={false} axisLine={false} tick={TICK} />
          <Bar dataKey="count" minPointSize={1} fill="currentColor" className="text-brand" isAnimationActive={false}>
            <LabelList dataKey="count" position="top" formatter={(value) => (value > 0 ? value : '')} className={VALUE_LABEL} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

export default CreatedChart;
