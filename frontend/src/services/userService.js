import api from './api';

/**
 * Fetch authenticated user profile details
 * @returns {Promise<Object>}
 */
export const getProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: error.message || 'Failed to fetch user profile.' };
  }
};

/**
 * Update authenticated user profile details
 * @param {Object} profileData 
 * @returns {Promise<Object>}
 */
export const updateProfile = async (profileData) => {
  try {
    const response = await api.put('/profile', profileData);
    return response.data;
  } catch (error) {
    if (error.response?.data) {
      throw error.response.data;
    }
    throw { message: error.message || 'Failed to update user profile.' };
  }
};

const userService = {
  getProfile,
  updateProfile,
};

export default userService;
