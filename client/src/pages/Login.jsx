// Login page (/login). Validates email and password, calls useAuth().login, then goes to the page the
// user originally wanted (location.state.from) or /projects. Shows a notice when the URL has ?reason=expired.
import { useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
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
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-8 font-sans text-slate-900">
      <div className="w-full max-w-md">
        <p className="mb-6 text-center text-xl font-bold">TaskBoard</p>
        <Card className="p-6">
          <h1 className="text-2xl font-semibold">Log in</h1>

          {searchParams.get('reason') === 'expired' && (
            <p
              role="status"
              className="mt-4 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700"
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
              value={values.email}
              onChange={handleChange}
              error={fieldErrors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              error={fieldErrors.password}
            />
            <Button type="submit" loading={submitting} className="w-full">
              Log in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to TaskBoard?{' '}
            <Link
              to="/register"
              className="font-medium text-indigo-600 hover:text-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Create account
            </Link>
          </p>
        </Card>
      </div>
    </main>
  );
};

export default Login;
