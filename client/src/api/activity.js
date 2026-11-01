// Activity feed API call (backend_schema.md 3.4), built on axiosClient. The feed is read only.
// listActivity returns the whole body { data, page, limit, total }: newest entries first, each with
// { _id, project, task?, actor, action, message, createdAt }. actor is { _id, name, email }, or null when that
// user was deleted. Entries are written just after the action that caused them, so the newest one can lag a moment.
import axiosClient from './axiosClient.js';

export const listActivity = (projectId, params) =>
  axiosClient.get(`/projects/${projectId}/activity`, { params }).then((response) => response.data);
