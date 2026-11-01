// Temporary dev page helper, development only. Section props: title, children. A titled block on the demo page.
const Section = ({ title, children }) => (
  <section className="space-y-3">
    <h2 className="text-base font-semibold text-fg">{title}</h2>
    {children}
  </section>
);

export default Section;
