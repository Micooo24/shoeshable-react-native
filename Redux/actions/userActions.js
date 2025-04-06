// userActions.js
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { SET_ORDERS, ORDERS_LOADING, ORDERS_ERROR, CLEAR_ORDERS } from '../constants';
import { getToken } from '../../sqlite_db/Auth';

// Action to fetch user orders with enhanced error handling
export const fetchUserOrders = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: ORDERS_LOADING });
      
      // Get authentication token
      const tokenData = await getToken();
      if (!tokenData || !tokenData.authToken) {
        throw new Error('Authentication token not found');
      }
      
      console.log('Fetching orders from API...');
      
      // Fetch orders from the API
      const response = await axios.get(
        `${baseURL}/api/users/orders`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.authToken}`
          }
        }
      );
      
      // Enhanced logging for debugging
      console.log('API Response for orders:', JSON.stringify(response.data));
      
      if (response.status === 200) {
        if (response.data) {
          // Dispatch the entire response - the reducer will handle the structure
          dispatch({
            type: SET_ORDERS,
            payload: response.data
          });
        } else {
          throw new Error('Invalid API response format');
        }
      } else {
        throw new Error(`API responded with status ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      
      // Try to get detailed error information
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch orders';
      console.error('Error details:', errorMessage);
      
      dispatch({
        type: ORDERS_ERROR,
        payload: errorMessage
      });
      
      // Create empty orders array on error to avoid UI breaking
      dispatch({
        type: SET_ORDERS,
        payload: { orders: [], orderCounts: { toPay: 0, toShip: 0, toDeliver: 0, toRate: 0 } }
      });
    }
  };
};

// Clear orders (used during logout)
export const clearOrders = () => {
  return {
    type: CLEAR_ORDERS
  };
};