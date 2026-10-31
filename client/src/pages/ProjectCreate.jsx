// Create project page (/projects/new). Name (3 to 80 characters) and description (max 500, with a live counter).
// Validates on submit, shows server errors ({ field, message }) under the matching field, shows a loading
// button while saving, then a success toast and a redirect to the new project.
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createProject } from '../api/projects.js';
import Button from '../components/Button.jsx';
import Card from '../components/Card.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Input from '../components/Input.jsx';
import Textarea from '../components/Textarea.jsx';
import { useToast } from '../context/ToastContext.jsx';

const DESCRIPTION_MAX = 500;

const validate = ({ name, description }) => {
  const errors = {};
  const trimmed = name.trim();
  if (!trimmed) errors.name = 'Name is required';
  else if (trimmed.length < 3 || trimmed.length > 80) errors.name = 'Name must be 3 to 80 characters';
  if (description.length > DESCRIPTION_MAX) errors.description = `Description must be at most ${DESCRIPTION_MAX} characters`;
  return errors;
};

const ProjectCreate = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [values, setValues] = useState({ name: '', description: '' });
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
      const project = await createProject({ name: values.name.trim(), description: values.description });
      showToast('Project created', 'success');
      navigate(`/projects/${project._id}`);
    } catch (error) {
      const data = error.response?.data;
      if (Array.isArray(data?.errors) && data.errors.length > 0) {
        const mapped = {};
        data.errors.forEach(({ field, message }) => {
          mapped[field] = message;
        });
        setFieldErrors(mapped);
      } else {
        setFormError(data?.message || 'Could not create the project. Please try again.');
      }
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md space-y-6">
      <div>
        <Link
          to="/projects"
          className="rounded text-sm font-medium text-indigo-600 hover:text-indigo-700 active:text-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          Back to projects
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-slate-900">New project</h1>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && <ErrorMessage message={formError} />}
          <Input
            label="Name"
            name="name"
            autoComplete="off"
            value={values.name}
            onChange={handleChange}
            error={fieldErrors.name}
          />
          <div>
            <Textarea
              label="Description"
              name="description"
              rows={4}
              value={values.description}
              onChange={handleChange}
              error={fieldErrors.description}
            />
            <p
              className={`mt-1 text-right text-xs ${values.description.length > DESCRIPTION_MAX ? 'text-red-600' : 'text-slate-500'}`}
            >
              {values.description.length}/{DESCRIPTION_MAX}
            </p>
          </div>
          <Button type="submit" loading={submitting} className="w-full">
            Create project
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ProjectCreate;
