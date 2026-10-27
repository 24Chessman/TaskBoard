// ErrorMessage props: message (text to show), onRetry (optional; shows a Retry button when given).
import Button from './Button.jsx';

const ErrorMessage = ({ message, onRetry }) => (
  <div role="alert" className="rounded-md border border-red-200 bg-red-50 p-4 text-red-700">
    <p className="text-sm">{message}</p>
    {onRetry && (
      <Button variant="secondary" className="mt-3" onClick={onRetry}>
        Retry
      </Button>
    )}
  </div>
);

export default ErrorMessage;
