import api from '../api';

export const getAdminAnalyticsOverall = async () => {
  const response = await api.get('/admin/analytics/overall');
  return response.data;
};

export const getAdminAnalyticsDaily = async () => {
  const response = await api.get('/admin/analytics/daily');
  return response.data;
};

export const getAdminAnalyticsMonthly = async () => {
  const response = await api.get('/admin/analytics/monthly');
  return response.data;
};

export const getAdminAnalyticsYearly = async () => {
  const response = await api.get('/admin/analytics/yearly');
  return response.data;
};
