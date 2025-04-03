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
import { getToken } from '../../sqlite_db/Auth';


//Add Cart Actions with Authenticated User
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

//Get Cart Actions with Authenticated User
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

// Update Cart Item Action
export const updateCartItem = (productId, updatedFields) => {
    return async (dispatch) => {
        try {
            // Get the token from the database
            const tokenData = await getToken();
            const authToken = tokenData?.authToken;

            if (!authToken) {
                console.error('No auth token found. User might not be logged in.');
                return {
                    success: false,
                    message: 'Unauthorized. Please log in to update the cart.',
                };
            }

            // Make the API request to update the cart item
            const response = await axios.put(
                `${baseURL}/api/cart/update`,
                { productId, ...updatedFields }, // Send productId and updated fields (size, color)
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
                    },
                }
            );

            // Dispatch the action to update the Redux store
            dispatch({
                type: UPDATE_CART_ITEM,
                payload: response.data.cartItem, // Assuming the API returns the updated cart item in response.data.cartItem
            });

            // Return the response for further handling
            return {
                success: true,
                message: response.data.message || 'Cart item updated successfully.',
                cartItem: response.data.cartItem,
            };
        } catch (error) {
            console.error('Error updating cart item:', error);

            // Handle specific error responses from the backend
            if (error.response && error.response.data) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to update cart item.',
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

// Update Cart Quantity Action
export const updateCartItemQuantity = (productId, quantity) => {
    return async (dispatch) => {
        try {
            // Get the token from the database
            const tokenData = await getToken();
            const authToken = tokenData?.authToken;

            if (!authToken) {
                console.error('No auth token found. User might not be logged in.');
                return {
                    success: false,
                    message: 'Unauthorized. Please log in to update the cart.',
                };
            }

            // Make the API request to update the cart quantity
            const response = await axios.put(
                `${baseURL}/api/cart/update-quantity`,
                { productId, quantity }, // Send productId and quantity
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
                    },
                }
            );

            // Dispatch the action to update the Redux store
            dispatch({
                type: UPDATE_CART_QUANTITY,
                payload: response.data.cartItem, // Assuming the API returns the updated cart item in response.data.cartItem
            });

            // Return the response for further handling
            return {
                success: true,
                message: response.data.message || 'Cart item quantity updated successfully.',
                cartItem: response.data.cartItem,
            };
        } catch (error) {
            console.error('Error updating cart item quantity:', error);

            // Handle specific error responses from the backend
            if (error.response && error.response.data) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to update cart item quantity.',
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

// Remove Cart Item Action
export const removeFromCart = (productId) => {
    return async (dispatch) => {
        try {
            // Get the token from the database
            const tokenData = await getToken();
            const authToken = tokenData?.authToken;

            if (!authToken) {
                console.error('No auth token found. User might not be logged in.');
                return {
                    success: false,
                    message: 'Unauthorized. Please log in to remove items from the cart.',
                };
            }

            // Make the API request to delete the cart item
            const response = await axios.delete(`${baseURL}/api/cart/delete`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
                },
                data: { productId }, // Send productId in the request body
            });

            // Dispatch the action to update the Redux store
            dispatch({
                type: REMOVE_FROM_CART,
                payload: productId, // Assuming the API confirms the item was removed
            });

            // Return the response for further handling
            return {
                success: true,
                message: response.data.message || 'Item removed from cart successfully.',
            };
        } catch (error) {
            console.error('Error removing item from cart:', error);

            // Handle specific error responses from the backend
            if (error.response && error.response.data) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to remove item from cart.',
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

// Clear Cart Action
export const clearCart = () => {
    return async (dispatch) => {
        try {
            // Get the token from the database
            const tokenData = await getToken();
            const authToken = tokenData?.authToken;

            if (!authToken) {
                console.error('No auth token found. User might not be logged in.');
                return {
                    success: false,
                    message: 'Unauthorized. Please log in to clear the cart.',
                };
            }

            // Make the API request to clear the cart
            const response = await axios.delete(`${baseURL}/api/cart/clear`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`, // Add the token to the Authorization header
                },
            });

            // Dispatch the action to clear the Redux store
            dispatch({
                type: CLEAR_CART, // Assuming you have a CLEAR_CART action type
            });

            // Return the response for further handling
            return {
                success: true,
                message: response.data.message || 'Cart cleared successfully.',
            };
        } catch (error) {
            console.error('Error clearing cart:', error);

            // Handle specific error responses from the backend
            if (error.response && error.response.data) {
                return {
                    success: false,
                    message: error.response.data.message || 'Failed to clear cart.',
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