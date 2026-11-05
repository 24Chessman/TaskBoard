// GitHub API call (backend_schema.md 3.3), built on axiosClient. lookupIssue(url) asks the server to look up a GitHub issue
// or pull request and returns { url, title, state }: url is the canonical link, title is at most 200 characters and state
// is "open" or "closed" (a merged pull request is "closed"). Failures arrive as axios errors: 400 (not a GitHub issue or
// pull request link), 404 (not found or private), 429 (GitHub rate limit) and 502 (GitHub could not be reached).
import axiosClient from './axiosClient.js';

export const lookupIssue = (url) =>
  axiosClient.get('/github/issue', { params: { url } }).then((response) => response.data.data);
