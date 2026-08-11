import api from '../api';

export const getAdminAnalyticsOverall = async () => {
  const response = await api.get('/admin/analytics/overall');
  return response.data;
};

export const getAdminAnalyticsDaily = async (date) => {
  const url = date ? `/admin/analytics/daily?date=${date}` : '/admin/analytics/daily';
  const response = await api.get(url);
  return response.data;
};

export const getAdminAnalyticsMonthly = async (date) => {
  const url = date ? `/admin/analytics/monthly?date=${date}` : '/admin/analytics/monthly';
  const response = await api.get(url);
  return response.data;
};

export const getAdminAnalyticsYearly = async (date) => {
  const url = date ? `/admin/analytics/yearly?date=${date}` : '/admin/analytics/yearly';
  const response = await api.get(url);
  return response.data;
};

export const getAdminAnalyticsToday = async () => {
  const response = await api.get('/admin/analytics/today');
  return response.data;
};

export const getAdminAnalyticsDate = async (date) => {
  const response = await api.get(`/admin/analytics/date?date=${date}`);
  return response.data;
};

export const getAdminAnalyticsMonth = async (date) => {
  const response = await api.get(`/admin/analytics/month?date=${date}`);
  return response.data;
};

export const getAdminAnalyticsYear = async (date) => {
  const response = await api.get(`/admin/analytics/year?date=${date}`);
  return response.data;
};
