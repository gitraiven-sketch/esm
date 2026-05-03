import axios from 'axios';
import { endpoints } from '@shared/config/api';

const api = axios.create({
  baseURL: endpoints.auth.replace('/api/auth', ''),
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ems_employee_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
