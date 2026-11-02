// FeatureRow props: id (optional anchor id), title (the row's h2, states an outcome), text (one short paragraph),
// facts (array of 2 or 3 plain strings), mock (a decorative mock element), reverse (put the mock on the left from
// 1024px up). The text is the real content: the mock repeats the same information visually and is aria-hidden.
import { Check } from 'lucide-react';

const FeatureRow = ({ id, title, text, facts, mock, reverse = false }) => (
  <section id={id} aria-labelledby={id ? `${id}-title` : undefined} className="scroll-mt-20 py-12 lg:py-16">
    <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
      <div className={`max-w-prose ${reverse ? 'lg:order-2' : ''}`}>
        <h2 id={id ? `${id}-title` : undefined} className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
          {title}
        </h2>
        <p className="mt-4 text-base text-fg-secondary">{text}</p>
        <ul className="mt-6 space-y-3">
          {facts.map((fact) => (
            <li key={fact} className="flex items-start gap-3 text-sm text-fg">
              <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-brand" />
              {fact}
            </li>
          ))}
        </ul>
      </div>
      <div className={`min-w-0 ${reverse ? 'lg:order-1' : ''}`}>{mock}</div>
    </div>
  </section>
);

export default FeatureRow;
