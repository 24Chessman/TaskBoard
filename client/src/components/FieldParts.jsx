// Small pieces shared by Input, Select and Textarea so the three look and behave the same:
//   fieldClasses(hasError)  the box style (border, ring, disabled look); red when there is an error
//   FieldLabel              the visible <label>
//   FieldError              the error text under a field (role="alert", linked with aria-describedby)
import { CircleAlert } from 'lucide-react';

export const fieldClasses = (hasError) =>
  `block w-full rounded-md border bg-surface px-3 py-1.5 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-40 ${
    hasError
      ? 'border-danger focus:border-danger focus:ring-danger/40'
      : 'border-line focus:border-brand-ring focus:ring-brand-ring/40'
  }`;

export const FieldLabel = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-fg">
    {children}
  </label>
);

export const FieldError = ({ id, children }) => (
  <p id={id} role="alert" className="mt-1 flex items-start gap-1 text-sm text-danger-fg">
    <CircleAlert size={14} aria-hidden="true" className="mt-0.5 shrink-0" />
    <span>{children}</span>
  </p>
);
