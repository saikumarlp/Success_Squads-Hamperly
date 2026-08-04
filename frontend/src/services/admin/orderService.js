import api from '../api';

export const getAdminOrders = async () => {
  const response = await api.get('/admin/orders');
  return response.data;
};

export const updateAdminOrderStatus = async (id, status) => {
  const response = await api.patch(`/admin/orders/${id}/status`, { status });
  return response.data;
};
