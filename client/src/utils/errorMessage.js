// errorMessage(error, fallback): one plain, specific message for any failed request, so raw axios texts such as
// "Network Error" or "timeout of 20000ms exceeded" never reach the screen. Says what happened and what to do.
//   no answer / timeout / 5xx / expired session  -> a fixed message (the server's own text is technical there)
//   other 4xx                                    -> the server's first field error or message (written for users)
// The login request keeps the server's 401 text ("Invalid email or password"). fallback is used when nothing fits.
export const NETWORK = 'Could not reach the server. Check your connection and try again.';
export const TIMEOUT = 'The server took too long to answer. Try again in a moment.';
export const SERVER = 'Something went wrong on our side. Try again in a moment.';
export const EXPIRED = 'Your session has expired. Sign in again.';
const BY_STATUS = {
  403: 'You do not have permission to do this.',
  404: 'That item no longer exists. Refresh the page and try again.',
};

const errorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  const response = error?.response;
  if (!response) return error?.code === 'ECONNABORTED' || error?.code === 'ETIMEDOUT' ? TIMEOUT : NETWORK;

  const { status, data } = response;
  if (status >= 500) return SERVER;
  if (status === 401 && !String(error.config?.url || '').endsWith('/auth/login')) return EXPIRED;

  const text = data?.errors?.[0]?.message || data?.message;
  if (text && !/^Not Found - /.test(text)) return text;
  return BY_STATUS[status] || fallback;
};

export default errorMessage;
