// ChartCard props: title (the card's <h2>), description (one sentence), summary (a sentence with the key numbers: it is the
// chart's accessible name), caption (optional small note under the chart), data (optional: { caption, columns, rows }
// for a visually hidden table with the same numbers), children (the chart itself).
// The visible chart is hidden from screen readers: they get the summary and the table instead.
import Card from '../Card.jsx';

const ChartCard = ({ title, description, summary, caption, data, children }) => (
  <section className="min-w-0">
    <Card className="p-5">
    <h2 className="text-base font-semibold text-fg">{title}</h2>
    <p className="mt-1 text-sm text-fg-secondary">{description}</p>
    <div role="img" aria-label={summary} className="mt-4">
      <div aria-hidden="true">{children}</div>
    </div>
    {data && (
      <table className="sr-only">
        <caption>{data.caption}</caption>
        <thead>
          <tr>
            {data.columns.map((column) => (
              <th key={column} scope="col">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row) => (
            <tr key={row[0]}>
              {row.map((cell, index) => (
                <td key={index}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )}
    {caption && <p className="mt-3 text-xs text-fg-secondary">{caption}</p>}
    </Card>
  </section>
);

export default ChartCard;
