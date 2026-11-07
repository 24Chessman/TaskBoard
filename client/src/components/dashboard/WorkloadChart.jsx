// WorkloadChart props: perMember ([{ userId, name, total, done }]), unassigned (open tasks with no assignee). One horizontal
// bar per member: the done part in cobalt, the rest in a light tint, so the full bar is the member's task count; the label
// at the end reads "done / total". Rows show the shared Avatar and the name ("Deleted user" for a deleted account).
import { Bar, BarChart, LabelList, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import Avatar from '../Avatar.jsx';
import ChartCard from './ChartCard.jsx';
import { VALUE_LABEL } from './chartStyle.js';
import { clip } from './helpers.js';
import RowTick from './RowTick.jsx';

const ROW = 36;
const LABEL_WIDTH = 150;

const WorkloadChart = ({ perMember, unassigned }) => {
  const rows = perMember.map((member, index) => ({ ...member, id: String(index), rest: member.total - member.done, text: `${member.done} / ${member.total}` }));
  const max = Math.max(1, ...rows.map((row) => row.total));
  const summary = rows.length
    ? `Workload by member: ${rows.map((row) => `${row.name} ${row.done} of ${row.total} done`).join(', ')}.${unassigned > 0 ? ` ${unassigned} open tasks have no lead.` : ''}`
    : 'No task has a lead yet.';

  return (
    <ChartCard
      title="Workload by member"
      description="Tasks each person leads, and how many of them are done."
      summary={summary}
      data={{ caption: 'Workload by member', columns: ['Member', 'Done', 'Total tasks'], rows: rows.map((row) => [row.name, row.done, row.total]) }}
    >
      {rows.length === 0 ? (
        <p className="py-6 text-sm text-fg-secondary">No task has a lead yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={rows.length * ROW + 8}>
          <BarChart layout="vertical" data={rows} margin={{ top: 4, right: 52, bottom: 4, left: 0 }} accessibilityLayer={false}>
            <XAxis type="number" hide domain={[0, max]} />
            <YAxis
              type="category"
              dataKey="id"
              width={LABEL_WIDTH}
              tickLine={false}
              tick={({ x, y, payload }) => {
                const row = rows[Number(payload.value)];
                return (
                  <RowTick x={x} y={y} width={LABEL_WIDTH}>
                    <Avatar user={row.userId ? { name: row.name } : null} size="xs" />
                    <span className="min-w-0 truncate">{clip(row.name, 16)}</span>
                  </RowTick>
                );
              }}
            />
            <Bar dataKey="done" stackId="work" barSize={14} fill="currentColor" className="text-brand" isAnimationActive={false} />
            <Bar dataKey="rest" stackId="work" barSize={14} fill="currentColor" className="text-brand/20 [&_path]:stroke-brand [&_path]:stroke-1" isAnimationActive={false}>
              <LabelList dataKey="text" position="right" className={VALUE_LABEL} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
      {unassigned > 0 && (
        <p className="mt-3 text-sm text-fg">
          <span className="font-mono tabular-nums">{unassigned}</span> open {unassigned === 1 ? 'task has' : 'tasks have'} no lead
        </p>
      )}
    </ChartCard>
  );
};

export default WorkloadChart;
