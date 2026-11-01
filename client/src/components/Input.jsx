// Input props: label, error (message shown under the field), className (for the wrapper),
// leadingIcon (a lucide icon component shown inside the left edge, optional), plus any native input props.
import { useId } from 'react';
import { FieldError, FieldLabel, fieldClasses } from './FieldParts.jsx';

const Input = ({ label, error, className = '', leadingIcon: LeadingIcon, ...rest }) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <div className="relative">
        {LeadingIcon && (
          <LeadingIcon
            size={16}
            aria-hidden="true"
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-fg-muted"
          />
        )}
        <input
          id={id}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`${fieldClasses(Boolean(error))} ${LeadingIcon ? 'pl-8' : ''}`}
          {...rest}
        />
      </div>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
};

export default Input;
