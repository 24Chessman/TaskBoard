// User API calls (backend_schema.md 3.1), built on axiosClient.
// searchUsers returns the whole list body { data, page, limit, total }. Normal users must search with at least
// 2 characters; each result has only _id, name and email.
import axiosClient from './axiosClient.js';

export const searchUsers = (search, params = {}) =>
  axiosClient.get('/users', { params: { ...params, search } }).then((response) => response.data);
