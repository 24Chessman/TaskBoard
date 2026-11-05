// Small helpers for GitHub links. Both are conveniences only: the server (utils/githubUrl.js there) stays the authority.
const MAX_LENGTH = 300;
const PATH_PATTERN = /^\/[A-Za-z0-9_.-]{1,100}\/[A-Za-z0-9_.-]{1,100}\/(issues|pull)\/\d{1,10}\/?$/;

// isGithubIssueUrl(text): true for https://github.com/owner/repo/issues/N or /pull/N (www.github.com too). Gives instant
// feedback in the form before a lookup. Anything that is not a string, is too long, is not https, has a user name,
// password or port, or points to another host or path is false.
export const isGithubIssueUrl = (text) => {
  if (typeof text !== 'string' || text.length === 0 || text.length > MAX_LENGTH) return false;
  let url;
  try {
    url = new URL(text.trim());
  } catch {
    return false;
  }
  if (url.protocol !== 'https:' || !['github.com', 'www.github.com'].includes(url.hostname)) return false;
  if (url.username || url.password || url.port) return false;
  return PATH_PATTERN.test(url.pathname);
};

// safeGithubHref(url): the url when it is safe to put in a link (a string starting with https://github.com/), else null.
// A stored value is never trusted: a javascript: or other-host value must not become a clickable link.
export const safeGithubHref = (url) =>
  typeof url === 'string' && url.startsWith('https://github.com/') && !/\s/.test(url) ? url : null;
