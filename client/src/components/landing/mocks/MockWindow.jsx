// MockWindow props: title (the project name shown in the title row), children, className.
// A static app-window frame for the landing mocks: a thin title row (the logo mark and the project name, not
// the three dots cliché) over the content. Purely decorative: aria-hidden, nothing focusable, no shadow or glow.
import Logo from '../../Logo.jsx';

const MockWindow = ({ title, children, className = '' }) => (
  <div aria-hidden="true" className={`overflow-hidden rounded-lg border border-line bg-surface ${className}`}>
    <div className="flex items-center gap-2 border-b border-line px-3 py-2 text-xs font-medium text-fg-secondary">
      <Logo showWordmark={false} size={16} />
      <span>{title}</span>
    </div>
    {children}
  </div>
);

export default MockWindow;
