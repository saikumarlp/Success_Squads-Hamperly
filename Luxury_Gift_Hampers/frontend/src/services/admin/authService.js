import api from '../api';

export const adminLogin = async (email, password) => {
  const response = await api.post('/admin/auth/login', { email, password });
  return response.data;
};

export const adminLogout = async () => {
  const response = await api.post('/admin/auth/logout');
  return response.data;
};

export const getAdminMe = async () => {
  const response = await api.get('/admin/auth/me');
  return response.data;
};
