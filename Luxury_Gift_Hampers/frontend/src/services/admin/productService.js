import api from '../api';

export const getAdminProducts = async (params) => {
  const response = await api.get('/admin/products', { params });
  return response.data;
};

export const getAdminProductById = async (id) => {
  const response = await api.get(`/admin/products/${id}`);
  return response.data;
};

export const createAdminProduct = async (productData) => {
  const response = await api.post('/admin/products', productData);
  return response.data;
};

export const updateAdminProduct = async (id, productData) => {
  const response = await api.put(`/admin/products/${id}`, productData);
  return response.data;
};

export const deleteAdminProduct = async (id) => {
  const response = await api.delete(`/admin/products/${id}`);
  return response.data;
};
