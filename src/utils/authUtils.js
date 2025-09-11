import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Authentication utility functions for token management
 */

/**
 * Get the stored authentication token
 * @returns {Promise<string|null>} The authentication token or null if not found
 */
export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Get the stored user data
 * @returns {Promise<Object|null>} The user data or null if not found
 */
export const getUserData = async () => {
  try {
    const userData = await AsyncStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if user has valid token and data
 */
export const isAuthenticated = async () => {
  try {
    const token = await getAuthToken();
    const userData = await getUserData();
    return !!(token && userData);
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};

/**
 * Clear all authentication data
 * @returns {Promise<void>}
 */
export const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(['userToken', 'userData']);
  } catch (error) {
    console.error('Error clearing auth data:', error);
  }
};

/**
 * Get authorization header for API requests
 * @returns {Promise<Object>} Headers object with Authorization header
 */
export const getAuthHeaders = async () => {
  try {
    const token = await getAuthToken();
    if (token) {
      return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
    }
    return {
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('Error getting auth headers:', error);
    return {
      'Content-Type': 'application/json',
    };
  }
};

/**
 * Create axios config with authentication headers
 * @param {Object} config - Axios config object
 * @returns {Promise<Object>} Axios config with auth headers
 */
export const createAuthenticatedRequest = async (config = {}) => {
  try {
    const headers = await getAuthHeaders();
    return {
      ...config,
      headers: {
        ...headers,
        ...config.headers,
      },
    };
  } catch (error) {
    console.error('Error creating authenticated request:', error);
    return config;
  }
};
