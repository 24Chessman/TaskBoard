// Select props: label, error (message shown under the field), className (for the wrapper), children (the <option>s),
// plus any native select props (aria-label, disabled, value, onChange...).
import { useId } from 'react';
import { FieldError, FieldLabel, fieldClasses } from './FieldParts.jsx';

const Select = ({ label, error, className = '', children, ...rest }) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <select
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={fieldClasses(Boolean(error))}
        {...rest}
      >
        {children}
      </select>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
};

export default Select;
