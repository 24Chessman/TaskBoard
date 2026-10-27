// Textarea props: label, error (message shown under the field), className, plus any native textarea props.
import { useId } from 'react';

const Textarea = ({ label, error, className = '', ...rest }) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-900">
          {label}
        </label>
      )}
      <textarea
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        {...rest}
      />
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Textarea;
