// Login page (/login). Validates email and password, calls useAuth().login, then goes to the page the
// user originally wanted (location.state.from) or /projects. Shows a notice when the URL has ?reason=expired.
import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import useAuth from '../hooks/useAuth.js';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  return errors;
};

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [values, setValues] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : '/projects';

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validate(values);
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      await login(values.email.trim(), values.password);
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setFormError(error.response?.data?.message || 'Could not log in. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Log in</h1>
      <p className="mt-1 text-sm text-fg-secondary">Welcome back. Enter your details to continue.</p>

      {searchParams.get('reason') === 'expired' && (
        <p
          role="status"
          className="mt-4 rounded-md border border-warning-strong/30 bg-warning-soft px-3 py-2 text-sm text-warning-fg"
        >
          Session expired. Please log in again.
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        {formError && <ErrorMessage message={formError} />}
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          leadingIcon={Mail}
          value={values.email}
          onChange={handleChange}
          error={fieldErrors.email}
        />
        <Input
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          leadingIcon={Lock}
          value={values.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />
        <Button type="submit" loading={submitting} className="w-full">
          Log in
        </Button>
      </form>

      <p className="mt-6 text-sm text-fg-secondary">
        New to TaskBoard?{' '}
        <Link to="/register" className="font-medium text-brand-fg underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
