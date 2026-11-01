// Profile page (/profile) for the signed-in user. Two forms, each in its own Card:
//   Account details  edit name and email (the PUT always needs both); role and join date are read-only.
//   Change password  current password, new password and a matching confirmation.
// The user comes from AuthContext. After a successful save the context user is replaced, so the navbar
// shows the new name straight away. Wrong current passwords come back as a 400 (never a 401), so they are shown
// under the field and never end the session.
import { useState } from 'react';
import { updateUser } from '../api/users.js';
import Badge from '../components/Badge.jsx';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useAuth from '../hooks/useAuth.js';
import { formatDate, localDateKey } from '../utils/dates.js';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const PASSWORD_MIN = 6;

// Turns a failed request into { fieldErrors, formError }. fieldMap renames server fields to form fields.
const readServerError = (error, fieldMap = {}) => {
  const data = error.response?.data;
  if (error.response?.status === 409) return { fieldErrors: { email: data.message }, formError: '' };
  if (Array.isArray(data?.errors) && data.errors.length > 0) {
    const fieldErrors = {};
    data.errors.forEach(({ field, message }) => {
      fieldErrors[fieldMap[field] || field] = message;
    });
    return { fieldErrors, formError: '' };
  }
  return { fieldErrors: {}, formError: data?.message || 'Something went wrong. Please try again.' };
};

const DetailsCard = ({ user, onUpdated }) => {
  const { showToast } = useToast();
  const [values, setValues] = useState({ name: user.name, email: user.email });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    const name = values.name.trim();
    const email = values.email.trim();
    if (!name) errors.name = 'Name is required';
    else if (name.length < 2 || name.length > 50) errors.name = 'Name must be 2 to 50 characters';
    if (!email) errors.email = 'Email is required';
    else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address';
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const updated = await updateUser(user._id, { name, email });
      onUpdated(updated);
      setValues({ name: updated.name, email: updated.email });
      showToast('Profile updated', 'success');
    } catch (error) {
      const result = readServerError(error);
      setFieldErrors(result.fieldErrors);
      setFormError(result.formError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <Card className="space-y-4 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Account details</h2>

        <dl className="grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-slate-500">Role</dt>
            <dd className="mt-1">
              <Badge variant={user.role === 'admin' ? 'primary' : 'neutral'}>
                {user.role === 'admin' ? 'Admin' : 'User'}
              </Badge>
            </dd>
          </div>
          <div>
            <dt className="text-xs text-slate-500">Member since</dt>
            <dd className="mt-1 text-slate-900">{formatDate(localDateKey(new Date(user.createdAt)))}</dd>
          </div>
        </dl>

        <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
          {formError && <ErrorMessage message={formError} />}
          <Input label="Name" name="name" autoComplete="name" value={values.name} onChange={handleChange} error={fieldErrors.name} />
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={handleChange}
            error={fieldErrors.email}
          />
          <Button type="submit" loading={saving}>
            Save changes
          </Button>
        </form>
      </Card>
    </section>
  );
};

const PasswordCard = ({ user, onUpdated }) => {
  const { showToast } = useToast();
  const empty = { currentPassword: '', newPassword: '', confirmPassword: '' };
  const [values, setValues] = useState(empty);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!values.currentPassword) errors.currentPassword = 'Current password is required';
    if (!values.newPassword) errors.newPassword = 'New password is required';
    else if (values.newPassword.length < PASSWORD_MIN) {
      errors.newPassword = `New password must be at least ${PASSWORD_MIN} characters`;
    }
    if (values.confirmPassword !== values.newPassword) errors.confirmPassword = 'Passwords do not match';
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      // The PUT needs name and email every time; the password only changes together with currentPassword
      const updated = await updateUser(user._id, {
        name: user.name,
        email: user.email,
        password: values.newPassword,
        currentPassword: values.currentPassword,
      });
      onUpdated(updated);
      setValues(empty);
      showToast('Password changed', 'success');
    } catch (error) {
      const result = readServerError(error, { password: 'newPassword' });
      setFieldErrors(result.fieldErrors);
      setFormError(result.formError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section>
      <Card className="space-y-4 p-6">
        <h2 className="text-lg font-semibold text-slate-900">Change password</h2>
        <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-4">
          {formError && <ErrorMessage message={formError} />}
          <Input
            label="Current password"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            value={values.currentPassword}
            onChange={handleChange}
            error={fieldErrors.currentPassword}
          />
          <Input
            label="New password"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={values.newPassword}
            onChange={handleChange}
            error={fieldErrors.newPassword}
          />
          <Input
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={values.confirmPassword}
            onChange={handleChange}
            error={fieldErrors.confirmPassword}
          />
          <Button type="submit" loading={saving}>
            Change password
          </Button>
        </form>
      </Card>
    </section>
  );
};

const Profile = () => {
  const { user, updateUser: setSessionUser } = useAuth();

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-semibold text-slate-900">Profile</h1>
      <DetailsCard user={user} onUpdated={setSessionUser} />
      <PasswordCard user={user} onUpdated={setSessionUser} />
    </div>
  );
};

export default Profile;
