import api from './api';

/**
 * Send password reset link to user email
 * @param {string} email 
 * @returns {Promise<Object>}
 */
export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: error.response?.data?.message || error.message || 'Something went wrong. Please try again.' };
  }
};

/**
 * Reset password using token
 * @param {Object} resetData - { token, newPassword, confirmPassword }
 * @returns {Promise<Object>}
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await api.post('/auth/reset-password', resetData);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: error.response?.data?.message || error.message || 'Something went wrong. Please try again.' };
  }
};

const authService = {
  forgotPassword,
  resetPassword,
};

export default authService;
