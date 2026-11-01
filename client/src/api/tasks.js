// Task API calls (backend_schema.md 3.3), built on axiosClient. Every task belongs to a project, so each call
// takes the projectId first. listTasks returns the whole list body { data, page, limit, total };
// getTask, createTask, updateTask and setTaskStatus return the task (assignee and createdBy populated, and
// either can be null for a deleted user); deleteTask returns nothing.
// Note: updateTask is a PUT that REPLACES the editable fields. Send title, description, priority, assignee,
// labels and dueDate every time, and githubIssue if the task has one, or the server clears what is missing.
import axiosClient from './axiosClient.js';

const unwrap = (response) => response.data.data;
const tasksUrl = (projectId) => `/projects/${projectId}/tasks`;

export const listTasks = (projectId, params) =>
  axiosClient.get(tasksUrl(projectId), { params }).then((response) => response.data);

export const getTask = (projectId, taskId) => axiosClient.get(`${tasksUrl(projectId)}/${taskId}`).then(unwrap);

export const createTask = (projectId, body) => axiosClient.post(tasksUrl(projectId), body).then(unwrap);

export const updateTask = (projectId, taskId, body) =>
  axiosClient.put(`${tasksUrl(projectId)}/${taskId}`, body).then(unwrap);

export const setTaskStatus = (projectId, taskId, status) =>
  axiosClient.patch(`${tasksUrl(projectId)}/${taskId}/status`, { status }).then(unwrap);

export const deleteTask = (projectId, taskId) =>
  axiosClient.delete(`${tasksUrl(projectId)}/${taskId}`).then(() => undefined);
