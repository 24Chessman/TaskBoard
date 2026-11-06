// Breadcrumbs props: items (array of { label, to }; the last one is the current page, shown as text with
// aria-current="page", and its "to" is ignored).
// PageHeader props: title (the page's only <h1>), breadcrumbs (items for Breadcrumbs, optional), description
// (optional line under the title), titleExtra (optional node next to the title, for example a status badge),
// actions (optional node on the right, for example a primary button).
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Breadcrumbs = ({ items }) => (
  <nav aria-label="Breadcrumb">
    <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-secondary">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <li key={`${item.label}-${index}`} className="flex min-w-0 items-center gap-1">
            {isLast ? (
              <span aria-current="page" className="truncate font-medium text-fg">
                {item.label}
              </span>
            ) : (
              <>
                <Link
                  to={item.to}
                  className="inline-flex items-center truncate rounded max-sm:-my-2.5 max-sm:py-2.5 hover:text-fg focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring"
                >
                  {item.label}
                </Link>
                <ChevronRight size={14} aria-hidden="true" className="shrink-0 text-fg-muted" />
              </>
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

const PageHeader = ({ title, breadcrumbs, description, titleExtra, actions }) => (
  <header className="mb-6 space-y-2">
    {breadcrumbs?.length > 0 && <Breadcrumbs items={breadcrumbs} />}
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="min-w-0 break-words text-xl font-semibold text-fg">{title}</h1>
          {titleExtra}
        </div>
        {description && <p className="mt-1 text-sm text-fg-secondary">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  </header>
);

export default PageHeader;
