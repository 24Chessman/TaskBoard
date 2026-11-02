// Textarea props: label, error (message shown under the field), className (for the wrapper),
// plus any native textarea props (rows, value, onChange...).
import { useId } from 'react';
import { FieldError, FieldLabel, fieldClasses } from './FieldParts.jsx';

const Textarea = ({ label, error, className = '', ...rest }) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <textarea
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className={fieldClasses(Boolean(error))}
        {...rest}
      />
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
};

export default Textarea;
