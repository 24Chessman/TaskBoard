// Dashboard API call (backend_schema.md 3.5), built on axiosClient. getDashboard returns the numbers for one project:
// { total, byStatus, byPriority, overdue, dueSoon, unassigned, perMember: [{ userId, name, total, done }],
//   topLabels: [{ label, count }], createdPerDay: [{ date, count }] }. userId is null (and name "Deleted user")
// for a deleted account. "Today" in these numbers is the start of the day in UTC.
import axiosClient from './axiosClient.js';

export const getDashboard = (projectId) =>
  axiosClient.get(`/projects/${projectId}/dashboard`).then((response) => response.data.data);
