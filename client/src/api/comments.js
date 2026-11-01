// Comment API calls (backend_schema.md 3.4), built on axiosClient. Comments belong to a task inside a project, so
// every call takes projectId and taskId first. listComments returns the whole list body { data, page, limit, total }
// (oldest first, author populated, and author is null when that user was deleted); createComment and updateComment
// return the comment; deleteComment returns nothing.
// Only the author may update a comment (others get 403). The author, the project owner or an admin may delete it.
import axiosClient from './axiosClient.js';

const unwrap = (response) => response.data.data;
const commentsUrl = (projectId, taskId) => `/projects/${projectId}/tasks/${taskId}/comments`;

export const listComments = (projectId, taskId, params) =>
  axiosClient.get(commentsUrl(projectId, taskId), { params }).then((response) => response.data);

export const createComment = (projectId, taskId, body) =>
  axiosClient.post(commentsUrl(projectId, taskId), body).then(unwrap);

export const updateComment = (projectId, taskId, commentId, body) =>
  axiosClient.put(`${commentsUrl(projectId, taskId)}/${commentId}`, body).then(unwrap);

export const deleteComment = (projectId, taskId, commentId) =>
  axiosClient.delete(`${commentsUrl(projectId, taskId)}/${commentId}`).then(() => undefined);
