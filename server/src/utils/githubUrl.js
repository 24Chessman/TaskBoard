// parseGithubUrl(input): checks that input is a link to a GitHub issue or pull request and returns
// { owner, repo, kind: "issues" | "pull", number, canonicalUrl }, or null when it is anything else (not a string, longer
// than 300 characters, not https, a host other than github.com or www.github.com, a user name, password or port in the URL,
// or a path that is not /owner/repo/issues/N or /owner/repo/pull/N). The query string and the fragment are ignored.
// canonicalUrl is always https://github.com/{owner}/{repo}/{issues|pull}/{number}. Pure: no network or database access.
const MAX_LENGTH = 300;
const PATH_PATTERN = /^\/([A-Za-z0-9_.-]{1,100})\/([A-Za-z0-9_.-]{1,100})\/(issues|pull)\/(\d{1,10})\/?$/;
const HOSTS = ['github.com', 'www.github.com'];

export const parseGithubUrl = (input) => {
  if (typeof input !== 'string' || input.length === 0 || input.length > MAX_LENGTH) return null;

  let url;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== 'https:' || !HOSTS.includes(url.hostname)) return null;
  if (url.username || url.password || url.port) return null;

  const match = PATH_PATTERN.exec(url.pathname);
  if (!match) return null;
  const [, owner, repo, kind, digits] = match;
  const number = Number(digits);
  if (owner === '.' || owner === '..' || repo === '.' || repo === '..' || number < 1) return null;

  return { owner, repo, kind, number, canonicalUrl: `https://github.com/${owner}/${repo}/${kind}/${number}` };
};
