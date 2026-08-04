import api from '../api';

export const getAdminUsers = async (params) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getAdminUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateAdminUser = async (id, userData) => {
  const response = await api.put(`/admin/users/${id}`, userData);
  return response.data;
};

export const patchAdminUserRole = async (id, role) => {
  const response = await api.patch(`/admin/users/${id}/role`, { role });
  return response.data;
};

export const toggleAdminUserBlock = async (id, blocked) => {
  const response = await api.patch(`/admin/users/${id}/block`, { blocked });
  return response.data;
};

export const resetAdminUserPassword = async (id, password) => {
  const response = await api.post(`/admin/users/${id}/reset-password`, { password });
  return response.data;
};
