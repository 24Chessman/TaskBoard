// RowTick props: x, y (given by Recharts: the right edge and middle of the row), width, children (any HTML, for example an
// avatar and a name). Draws a row label on a horizontal bar chart's category axis: a foreignObject, so the real shared
// components (PriorityBadge, Avatar, Badge) can be used as labels. Purely visual: the chart's table carries the data.
const RowTick = ({ x, y, width, children }) => (
  <foreignObject x={x - width} y={y - 14} width={width} height={28}>
    <div className="flex h-7 items-center justify-end gap-2 pr-2 text-sm text-fg">{children}</div>
  </foreignObject>
);

export default RowTick;
