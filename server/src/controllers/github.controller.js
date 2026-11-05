// GitHub controller: looks up one GitHub issue or pull request for the task form (GET /api/github/issue?url=).
// Only the server talks to GitHub (so an optional GITHUB_TOKEN never reaches the browser). The request goes to
// https://api.github.com/repos/{owner}/{repo}/issues/{number}, built from the parts parseGithubUrl found, never from the
// user's URL. GitHub's response body and headers are never forwarded, and the token is never logged or returned.
// Successful lookups are cached in memory (100 entries, 5 minutes, oldest entry removed first); failures are not cached.
import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { parseGithubUrl } from '../utils/githubUrl.js';

const TIMEOUT_MS = 5000;
const TITLE_MAX = 200;
const CACHE_MAX = 100;
const CACHE_TTL_MS = 5 * 60 * 1000;
const NOT_FOUND = 'GitHub issue not found (it may be private or the number is wrong)';
const RATE_LIMIT = 'GitHub rate limit reached, try again in a few minutes';
const UNREACHABLE = 'Could not reach GitHub';

// A small cache of successful lookups, keyed by canonical URL. A Map keeps insertion order, so the first key is the oldest.
export const createIssueCache = ({ max = CACHE_MAX, ttlMs = CACHE_TTL_MS, now = () => Date.now() } = {}) => {
  const entries = new Map();
  return {
    get(key) {
      const entry = entries.get(key);
      if (!entry) return undefined;
      if (now() - entry.savedAt >= ttlMs) {
        entries.delete(key);
        return undefined;
      }
      return entry.value;
    },
    set(key, value) {
      entries.delete(key);
      if (entries.size >= max) entries.delete(entries.keys().next().value);
      entries.set(key, { value, savedAt: now() });
    },
    size: () => entries.size,
  };
};

const defaultCache = createIssueCache();

// lookupGithubIssue(parsed, { fetchFn, cache }) -> { url, title, state }; throws an ApiError for every failure.
export const lookupGithubIssue = async (parsed, { fetchFn = (...args) => fetch(...args), cache = defaultCache } = {}) => {
  const cached = cache.get(parsed.canonicalUrl);
  if (cached) return cached;

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'TaskBoard-course-project',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  let response;
  let body;
  try {
    response = await fetchFn(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/issues/${parsed.number}`, {
      headers,
      redirect: 'manual',
      signal: controller.signal,
    });
    if (response.status >= 200 && response.status < 300) body = await response.json();
  } catch {
    throw new ApiError(502, UNREACHABLE);
  } finally {
    clearTimeout(timer);
  }

  if (response.status === 404) throw new ApiError(404, NOT_FOUND);
  if (response.status === 403 || response.status === 429) throw new ApiError(429, RATE_LIMIT);
  // Anything else that is not a plain success (a redirect included) is an error: we never follow it to another host
  if (response.status < 200 || response.status >= 300 || !body || typeof body.title !== 'string') {
    throw new ApiError(502, UNREACHABLE);
  }

  const result = {
    url: parsed.canonicalUrl,
    title: body.title.trim().slice(0, TITLE_MAX),
    state: body.state === 'open' ? 'open' : 'closed',
  };
  cache.set(parsed.canonicalUrl, result);
  return result;
};

// GET /api/github/issue?url= : any logged-in user
export const getIssue = asyncHandler(async (req, res) => {
  const { url } = req.query;
  const parsed = typeof url === 'string' ? parseGithubUrl(url) : null;
  if (!parsed) {
    const message = 'url must be a link to a GitHub issue or pull request, like https://github.com/owner/repo/issues/1';
    throw new ApiError(400, 'Validation Error', [{ field: 'url', message }]);
  }

  res.status(200).json({ success: true, data: await lookupGithubIssue(parsed) });
});
