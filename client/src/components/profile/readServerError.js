import errorMessage from '../../utils/errorMessage.js';

// readServerError(error, fieldMap): turns a failed request into { fieldErrors, formError }.
// fieldMap renames server field names to form field names. A 409 is an email that is already taken.
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
  return { fieldErrors: {}, formError: errorMessage(error) };
};

export default readServerError;
