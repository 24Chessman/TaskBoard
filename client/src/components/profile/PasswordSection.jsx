// PasswordSection props: user, onUpdated (called with the saved user). Current password, new password (6+ characters)
// and a matching confirmation. A wrong current password comes back as a 400 and is shown under the field; it never
// ends the session.
import { useState } from 'react';
import { updateUser } from '../../api/users.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../Button.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import Input from '../Input.jsx';
import SettingsSection from '../settings/SettingsSection.jsx';
import readServerError from './readServerError.js';

const PASSWORD_MIN = 6;
const empty = { currentPassword: '', newPassword: '', confirmPassword: '' };

const PasswordSection = ({ user, onUpdated }) => {
  const { showToast } = useToast();
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
    <SettingsSection from="lg" contentClassName="max-w-[30rem]" title="Change password" description="Use at least 6 characters.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
    </SettingsSection>
  );
};

export default PasswordSection;
