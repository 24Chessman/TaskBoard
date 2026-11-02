// Register page (/register). Asks name, email and password only (never a role), validates them,
// calls useAuth().register and goes to /projects. Server errors ({ field, message }) are shown under the
// matching field; a duplicate email (409) is shown under the email field.
import { useState } from 'react';
import { Lock, Mail, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/auth/AuthLayout.jsx';
import Button from '../components/Button.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import useAuth from '../hooks/useAuth.js';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const validate = ({ name, email, password }) => {
  const errors = {};
  const trimmedName = name.trim();
  if (!trimmedName) errors.name = 'Name is required';
  else if (trimmedName.length < 2 || trimmedName.length > 50) errors.name = 'Name must be 2 to 50 characters';
  if (!email.trim()) errors.email = 'Email is required';
  else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address';
  if (!password) errors.password = 'Password is required';
  else if (password.length < 6) errors.password = 'Password must be at least 6 characters';
  return errors;
};

// Turns a failed request into { fieldErrors, formError } for the form.
const readServerError = (error) => {
  const data = error.response?.data;
  if (error.response?.status === 409) return { fieldErrors: { email: data.message }, formError: '' };
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const fieldErrors = {};
    data.errors.forEach(({ field, message }) => {
      fieldErrors[field] = message;
    });
    return { fieldErrors, formError: '' };
  }
  return { fieldErrors: {}, formError: data?.message || 'Could not create the account. Please try again.' };
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      await register(values.name.trim(), values.email.trim(), values.password);
      navigate('/projects', { replace: true });
    } catch (error) {
      const result = readServerError(error);
      setFieldErrors(result.fieldErrors);
      setFormError(result.formError);
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Create your account</h1>
      <p className="mt-1 text-sm text-fg-secondary">It takes a minute. No card needed.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        {formError && <ErrorMessage message={formError} />}
        <Input
          label="Name"
          name="name"
          autoComplete="name"
          leadingIcon={User}
          value={values.name}
          onChange={handleChange}
          error={fieldErrors.name}
        />
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
          autoComplete="new-password"
          leadingIcon={Lock}
          value={values.password}
          onChange={handleChange}
          error={fieldErrors.password}
        />
        <Button type="submit" loading={submitting} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-6 text-sm text-fg-secondary">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand-fg underline-offset-4 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-ring">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
