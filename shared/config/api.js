const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export const endpoints = {
  auth: `${API_BASE}/api/auth`,
  employees: `${API_BASE}/api/employees`,
  attendance: `${API_BASE}/api/attendance`,
  announcements: `${API_BASE}/api/announcements`,
  leaves: `${API_BASE}/api/leaves`,
  contracts: `${API_BASE}/api/contracts`,
  chat: `${API_BASE}/api/chat`,
  reports: `${API_BASE}/api/reports`,
  notifications: `${API_BASE}/api/notifications`
};
