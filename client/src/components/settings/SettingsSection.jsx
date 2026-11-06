// SettingsSection props: title (the section's <h2>), description (optional one-line help), danger (red heading and
// border for the danger zone), children, from ("md" | "lg", default "md": the breakpoint where the two columns start:
// title and help left, content right; one column below), contentClassName (default "max-w-xl": the width of the
// content column).
// messageOf(error) turns an API error into one readable message (shared by all settings sections).
import errorMessage from '../../utils/errorMessage.js';
export const messageOf = (error) => errorMessage(error);

const COLUMNS = {
  md: 'md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8',
  lg: 'lg:grid-cols-[14rem_minmax(0,1fr)] lg:gap-8',
};

const SettingsSection = ({ title, description, danger = false, from = 'md', contentClassName = 'max-w-xl', children }) => (
  <section
    className={`grid gap-4 py-6 ${COLUMNS[from] || COLUMNS.md} ${
      danger ? 'rounded-lg border border-danger/30 px-4 md:px-6' : ''
    }`}
  >
    <div>
      <h2 className={`text-base font-semibold ${danger ? 'text-danger' : 'text-fg'}`}>{title}</h2>
      {description && <p className="mt-1 text-sm text-fg-secondary">{description}</p>}
    </div>
    <div className={`min-w-0 space-y-4 ${contentClassName}`}>{children}</div>
  </section>
);

export default SettingsSection;
