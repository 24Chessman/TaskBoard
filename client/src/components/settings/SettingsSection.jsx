// SettingsSection props: title (the section's <h2>), description (optional one-line help), danger (red heading and
// border for the danger zone), children. Two columns from 768px (title and help left, content right), one column below.
// messageOf(error) turns an API error into one readable message (shared by all settings sections).
export const messageOf = (error) =>
  error.response?.data?.errors?.[0]?.message ||
  error.response?.data?.message ||
  'Something went wrong. Please try again.';

const SettingsSection = ({ title, description, danger = false, children }) => (
  <section
    className={`grid gap-4 py-6 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-8 ${
      danger ? 'rounded-lg border border-danger/30 px-4 md:px-6' : ''
    }`}
  >
    <div>
      <h2 className={`text-base font-semibold ${danger ? 'text-danger' : 'text-fg'}`}>{title}</h2>
      {description && <p className="mt-1 text-sm text-fg-secondary">{description}</p>}
    </div>
    <div className="min-w-0 max-w-xl space-y-4">{children}</div>
  </section>
);

export default SettingsSection;
