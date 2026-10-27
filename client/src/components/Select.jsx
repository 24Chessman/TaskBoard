// Select props: label, error (message shown under the field), className, children (the <option>s),
// plus any native select props.
import { useId } from 'react';

const Select = ({ label, error, className = '', children, ...rest }) => {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-900">
          {label}
        </label>
      )}
      <select
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={error ? errorId : undefined}
        className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        {...rest}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} role="alert" className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Select;
