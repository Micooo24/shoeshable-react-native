import { 
    CREATE_ORDER,
    GET_ORDER, 
    GET_MY_ORDERS,
    GET_ALL_ORDERS,
    UPDATE_ORDER,
    DELETE_ORDER,
    SET_CURRENT_ORDER,
    CLEAR_ORDER
} from '../constants';

import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import { getToken } from '../../sqlite_db/Auth';
import { CLEAR_CART } from '../constants';

// Create a new order
export const createOrder = (orderData) => {
    return async (dispatch) => {
        try {
            const tokenData = await getToken();
            if (!tokenData || !tokenData.authToken) {
                throw new Error('Authentication required');
            }
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenData.authToken}`
                }
            };
            
            const response = await axios.post(
                `${baseURL}/api/orders/create`, 
                orderData, 
                config
            );
            
            if (response.data && response.data.success) {
                dispatch({
                    type: CREATE_ORDER,
                    payload: response.data.order
                });
                
                // Clear cart after successful order
                dispatch({
                    type: CLEAR_CART
                });
                
                return response.data.order;
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            console.error('Create Order Error:', error);
            throw error;
        }
    };
};

// Get a single order by ID
export const getOrderDetails = (orderId) => {
    return async (dispatch) => {
        try {
            const tokenData = await getToken();
            if (!tokenData || !tokenData.authToken) {
                throw new Error('Authentication required');
            }
            
            const config = {
                headers: {
                    'Authorization': `Bearer ${tokenData.authToken}`
                }
            };
            
            const response = await axios.get(
                `${baseURL}/api/orders/${orderId}`, 
                config
            );
            
            if (response.data && response.data.success) {
                dispatch({
                    type: GET_ORDER,
                    payload: response.data.order
                });
                
                return response.data.order;
            } else {
                throw new Error('Failed to fetch order details');
            }
        } catch (error) {
            console.error('Get Order Details Error:', error);
            throw error;
        }
    };
};

// Get current user's orders
export const getMyOrders = () => {
    return async (dispatch) => {
        try {
            const tokenData = await getToken();
            if (!tokenData || !tokenData.authToken) {
                throw new Error('Authentication required');
            }
            
            const config = {
                headers: {
                    'Authorization': `Bearer ${tokenData.authToken}`
                }
            };
            
            const response = await axios.get(
                `${baseURL}/api/orders/myorders`, 
                config
            );
            
            if (response.data && response.data.success) {
                dispatch({
                    type: GET_MY_ORDERS,
                    payload: response.data.orders
                });
                
                return response.data.orders;
            } else {
                throw new Error('Failed to fetch user orders');
            }
        } catch (error) {
            console.error('Get My Orders Error:', error);
            throw error;
        }
    };
};

// Get all orders (Admin)
export const getAllOrders = () => {
    return async (dispatch) => {
        try {
            const tokenData = await getToken();
            if (!tokenData || !tokenData.authToken) {
                throw new Error('Authentication required');
            }
            
            const config = {
                headers: {
                    'Authorization': `Bearer ${tokenData.authToken}`
                }
            };
            
            const response = await axios.get(
                `${baseURL}/api/orders`, 
                config
            );
            
            if (response.data && response.data.success) {
                dispatch({
                    type: GET_ALL_ORDERS,
                    payload: response.data.orders
                });
                
                return response.data;
            } else {
                throw new Error('Failed to fetch all orders');
            }
        } catch (error) {
            console.error('Get All Orders Error:', error);
            throw error;
        }
    };
};

// Update order status
export const updateOrder = (orderId, status) => {
    return async (dispatch) => {
        try {
            const tokenData = await getToken();
            if (!tokenData || !tokenData.authToken) {
                throw new Error('Authentication required');
            }
            
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${tokenData.authToken}`
                }
            };
            
            const response = await axios.put(
                `${baseURL}/api/orders/${orderId}`, 
                { status }, 
                config
            );
            
            if (response.data && response.data.success) {
                dispatch({
                    type: UPDATE_ORDER,
                    payload: response.data.order
                });
                
                return response.data.order;
            } else {
                throw new Error('Failed to update order');
            }
        } catch (error) {
            console.error('Update Order Error:', error);
            throw error;
        }
    };
};

// Delete order
export const deleteOrder = (orderId) => {
    return async (dispatch) => {
        try {
            const tokenData = await getToken();
            if (!tokenData || !tokenData.authToken) {
                throw new Error('Authentication required');
            }
            
            const config = {
                headers: {
                    'Authorization': `Bearer ${tokenData.authToken}`
                }
            };
            
            const response = await axios.delete(
                `${baseURL}/api/orders/${orderId}`, 
                config
            );
            
            if (response.data && response.data.success) {
                dispatch({
                    type: DELETE_ORDER,
                    payload: orderId
                });
                
                return response.data;
            } else {
                throw new Error('Failed to delete order');
            }
        } catch (error) {
            console.error('Delete Order Error:', error);
            throw error;
        }
    };
};

// Set current selected order (for UI purposes)
export const setCurrentOrder = (order) => {
    return {
        type: SET_CURRENT_ORDER,
        payload: order
    };
};

// Clear current order
export const clearOrder = () => {
    return {
        type: CLEAR_ORDER
    };
};