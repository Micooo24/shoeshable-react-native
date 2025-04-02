import {
    ADD_TO_CART,
    REMOVE_FROM_CART,
    CLEAR_CART,
    GET_CART,
    UPDATE_CART_ITEM,
    UPDATE_CART_QUANTITY,
} from '../constants';
import baseURL from '../../assets/common/baseurl';
import axios from 'axios';
import { getToken } from '../../utils/Auth';

export const addToCart = (product) => {
    return async (dispatch) => {
        try {
            // Get the token from the database
            const tokenData = await getToken();
            const authToken = tokenData?.authToken;

            if (!authToken) {
                console.error('No auth token found. User might not be logged in.');
                return {
                    success: false,
                    message: 'Unauthorized. Please log in to add items to the cart.',
                };
            }

            // Make the API request with the Authorization header
            const response = await axios.post(`${baseURL}/api/cart/add`, product, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
                },
            });

            // Dispatch the action to update the Redux store
            dispatch({
                type: ADD_TO_CART,
                payload: response.data.cartItem, // Assuming the API returns the cart item in response.data.cartItem
            });

            // Return the response for further handling
            return {
                success: true,
                message: response.data.message || 'Item added to cart successfully.',
                cartItem: response.data.cartItem,
                user: response.data.user,
            };
        } catch (error) {
            console.error('Error adding to cart:', error);

            // Handle specific error responses from the backend
            if (error.response && error.response.data) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to add item to cart.',
                };
            }

            // Handle unexpected errors
            return {
                success: false,
                message: 'An unexpected error occurred. Please try again.',
            };
        }
    };
};

// New getCarts action
export const getCarts = () => {
    return async (dispatch) => {
        try {
            // Get the token from the database
            const tokenData = await getToken();
            const authToken = tokenData?.authToken;

            if (!authToken) {
                console.error('No auth token found. User might not be logged in.');
                return {
                    success: false,
                    message: 'Unauthorized. Please log in to view your cart.',
                };
            }

            // Make the API request to fetch all cart items
            const response = await axios.get(`${baseURL}/api/cart/all`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
                },
            });

            // Dispatch the action to update the Redux store
            dispatch({
                type: GET_CART,
                payload: response.data.cartItems, // Assuming the API returns cart items in response.data.cartItems
            });

            // Return the response for further handling
            return {
                success: true,
                cartItems: response.data.cartItems,
            };
        } catch (error) {
            console.error('Error fetching cart items:', error);

            // Handle specific error responses from the backend
            if (error.response && error.response.data) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to fetch cart items.',
                };
            }

            // Handle unexpected errors
            return {
                success: false,
                message: 'An unexpected error occurred. Please try again.',
            };
        }
    };
};