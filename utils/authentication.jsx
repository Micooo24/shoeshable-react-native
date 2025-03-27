import * as SecureStore from 'expo-secure-store';
import jwtDecode from 'jwt-decode';

/**
 * Save the JWT token securely in Expo Secure Store.
 * @param {string} token - The JWT token to save.
 */
export const saveToken = async (token) => {
  try {
    await SecureStore.setItemAsync('authToken', token);
    console.log('authToken:', token);
    console.log('Token saved successfully');
  } catch (error) {
    console.error('Error saving token:', error);
  }     
};

/**
 * Retrieve the JWT token from Expo Secure Store.
 * @returns {Promise<string|null>} - The stored token or null if not found.
 */
export const getToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) {
      console.log('Retrieved token:', token);
      return token;
    } else {
      console.log('No token found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

/**
 * Save user data securely in Expo Secure Store.
 * @param {object} userData - The user data to save.
 */
export const saveUserData = async (userData) => {   
  try {
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
    console.log('userData:', userData);
    console.log('User data saved successfully');
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};

/**
 * Retrieve user data from Expo Secure Store.
 * @returns {Promise<object|null>} - The stored user data or null if not found.
 */
export const getUserData = async () => {
  try {
    const userData = await SecureStore.getItemAsync('userData');
    if (userData) {
      console.log('Retrieved user data:', JSON.parse(userData));
      return JSON.parse(userData);
    } else {
      console.log('No user data found');
      return null;
    }
  } catch (error) {
    console.error('Error retrieving user data:', error);
    return null;
  }
};

/**
 * Decode the JWT token to access its payload.
 * @returns {Promise<object|null>} - The decoded token payload or null if decoding fails.
 */
export const decodeToken = async () => {
  try {
    const token = await getToken();
    if (token) {
      const decoded = jwtDecode(token);
      console.log('Decoded token:', decoded);
      return decoded;
    } else {
      console.log('No token found to decode');
      return null;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Check if the JWT token has expired.
 * @returns {Promise<boolean>} - True if the token has expired, false otherwise.
 */
export const isTokenExpired = async () => {
  try {
    const decoded = await decodeToken();
    if (decoded) {
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      if (decoded.exp < currentTime) {
        console.log('Token has expired');
        return true;
      } else {
        console.log('Token is valid');
        return false;
      }
    } else {
      console.log('No token found to check expiration');
      return true;
    }
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true;
  }
};

/**
 * Clear the JWT token and user data from Expo Secure Store.
 */
export const removeToken = async () => {
  try {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('userData');
    console.log('Token and user data cleared successfully');
  } catch (error) {
    console.error('Error clearing SecureStore data:', error);
  }
};