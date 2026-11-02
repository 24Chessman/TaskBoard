// DetailsCard props: user, onUpdated (called with the saved user). Edit name and email (the PUT always needs both).
// Validates on submit, shows server errors under the field (an email already in use is a field error), toast on success.
import { useState } from 'react';
import { updateUser } from '../../api/users.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../Button.jsx';
import Card from '../Card.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import Input from '../Input.jsx';
import readServerError from './readServerError.js';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

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
    <section aria-labelledby="profile-details-title">
      <Card className="p-6">
        <h2 id="profile-details-title" className="mb-4 text-base font-semibold text-fg">
          Account details
        </h2>
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

export default DetailsCard;
