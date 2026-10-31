// Project API calls (backend_schema.md 3.2), built on axiosClient (token and 401 handling included).
// Every function returns a promise. listProjects returns the whole list body { data, page, limit, total };
// the others return the unwrapped data (the project), and deleteProject / removeMember return nothing.
// Errors are thrown as axios errors: read error.response.data.message and error.response.data.errors.
import axiosClient from './axiosClient.js';

const unwrap = (response) => response.data.data;

export const listProjects = (params) => axiosClient.get('/projects', { params }).then((response) => response.data);

export const getProject = (id) => axiosClient.get(`/projects/${id}`).then(unwrap);

export const createProject = (body) => axiosClient.post('/projects', body).then(unwrap);

export const updateProject = (id, body) => axiosClient.put(`/projects/${id}`, body).then(unwrap);

export const setProjectStatus = (id, status) => axiosClient.patch(`/projects/${id}/status`, { status }).then(unwrap);

export const deleteProject = (id) => axiosClient.delete(`/projects/${id}`).then(() => undefined);

export const addMember = (id, userId) => axiosClient.post(`/projects/${id}/members`, { userId }).then(unwrap);

export const removeMember = (id, userId) => axiosClient.delete(`/projects/${id}/members/${userId}`).then(() => undefined);
