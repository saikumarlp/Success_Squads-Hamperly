import api from '../api';

export const getAdminOrders = async (search, status) => {
  const params = {};
  if (search) params.search = search;
  if (status) params.status = status;
  const response = await api.get('/admin/orders', { params });
  return response.data;
};

export const updateAdminOrderStatus = async (id, status) => {
  const response = await api.patch(`/admin/orders/${id}/status`, { status });
  return response.data;
};
