// DetailsSection props: project, refreshProject. Edit name (3 to 80 characters) and description (max 500, live
// counter). Validates on submit, shows server field errors under the field, toast on success (PUT).
import { useState } from 'react';
import { updateProject } from '../../api/projects.js';
import { useToast } from '../../context/ToastContext.jsx';
import Button from '../Button.jsx';
import ErrorMessage from '../ErrorMessage.jsx';
import Input from '../Input.jsx';
import Textarea from '../Textarea.jsx';
import SettingsSection, { messageOf } from './SettingsSection.jsx';

const DESCRIPTION_MAX = 500;

const validateDetails = ({ name, description }) => {
  const errors = {};
  const trimmed = name.trim();
  if (!trimmed) errors.name = 'Name is required';
  else if (trimmed.length < 3 || trimmed.length > 80) errors.name = 'Name must be 3 to 80 characters';
  if (description.length > DESCRIPTION_MAX) errors.description = `Description must be at most ${DESCRIPTION_MAX} characters`;
  return errors;
};

const DetailsSection = ({ project, refreshProject }) => {
  const { showToast } = useToast();
  const [values, setValues] = useState({ name: project.name, description: project.description || '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateDetails(values);
    setFieldErrors(errors);
    setFormError('');
    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      await updateProject(project._id, { name: values.name.trim(), description: values.description });
      showToast('Project updated', 'success');
      refreshProject();
    } catch (error) {
      const list = error.response?.data?.errors;
      if (Array.isArray(list) && list.length > 0) {
        const mapped = {};
        list.forEach(({ field, message }) => {
          mapped[field] = message;
        });
        setFieldErrors(mapped);
      } else {
        setFormError(messageOf(error));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <SettingsSection title="Details" description="The name and description people see on the project list.">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && <ErrorMessage message={formError} />}
        <Input label="Name" name="name" autoComplete="off" value={values.name} onChange={handleChange} error={fieldErrors.name} />
        <div>
          <Textarea
            label="Description"
            name="description"
            rows={4}
            value={values.description}
            onChange={handleChange}
            error={fieldErrors.description}
          />
          <p className={`mt-1 text-right font-mono text-xs ${values.description.length > DESCRIPTION_MAX ? 'text-danger' : 'text-fg-secondary'}`}>
            {values.description.length}/{DESCRIPTION_MAX}
          </p>
        </div>
        <Button type="submit" loading={saving}>
          Save changes
        </Button>
      </form>
    </SettingsSection>
  );
};

export default DetailsSection;
