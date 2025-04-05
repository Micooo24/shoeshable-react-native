import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { SET_ORDERS, ORDERS_LOADING, ORDERS_ERROR, CLEAR_ORDERS } from '../constants';
import { getToken } from '../../sqlite_db/Auth';

// Action to fetch user orders
export const fetchUserOrders = () => {
  return async (dispatch) => {
    try {
      dispatch({ type: ORDERS_LOADING });
      
      // Get authentication token
      const tokenData = await getToken();
      if (!tokenData || !tokenData.authToken) {
        throw new Error('Authentication token not found');
      }
      
      // Fetch orders from the API
      const response = await axios.get(
        `${baseURL}/api/orders/user`,
        {
          headers: {
            Authorization: `Bearer ${tokenData.authToken}`
          }
        }
      );
      
      if (response.data) {
        dispatch({
          type: SET_ORDERS,
          payload: response.data
        });
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      dispatch({
        type: ORDERS_ERROR,
        payload: error.response?.data?.message || 'Failed to fetch orders'
      });
    }
  };
};

// Action to clear orders (used during logout)
export const clearOrders = () => {
  return {
    type: CLEAR_ORDERS
  };
};