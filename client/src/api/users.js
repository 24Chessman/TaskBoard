// User API calls (backend_schema.md 3.1), built on axiosClient.
// searchUsers and listUsers return the whole list body { data, page, limit, total }. Normal users must search with
// at least 2 characters and only see _id, name and email; admins may list without a search and also get role and
// createdAt. getUser, updateUser and setUserRole return the user; deleteUser returns nothing.
// updateUser is a PUT: send name and email every time, plus password and currentPassword only to change the password
// (a non-admin changing their own password must send the correct currentPassword; a wrong one is a 400).
import axiosClient from './axiosClient.js';

export const searchUsers = (search, params = {}) =>
  axiosClient.get('/users', { params: { ...params, search } }).then((response) => response.data);

export const listUsers = (params) => axiosClient.get('/users', { params }).then((response) => response.data);

export const getUser = (id) => axiosClient.get(`/users/${id}`).then((response) => response.data.data);

export const updateUser = (id, body) => axiosClient.put(`/users/${id}`, body).then((response) => response.data.data);

export const setUserRole = (id, role) =>
  axiosClient.patch(`/users/${id}/role`, { role }).then((response) => response.data.data);

export const deleteUser = (id) => axiosClient.delete(`/users/${id}`).then(() => undefined);
